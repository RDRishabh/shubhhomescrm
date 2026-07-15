import { Router, Request, Response } from 'express';
import multer from 'multer';
import prisma from '../lib/prisma';
import { parseExcelBuffer } from '../services/excelParser';
import { autoDetectMapping, transformRow, CRM_FIELDS } from '../services/columnMapper';

const router = Router();

// Configure multer for file upload (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel (.xlsx, .xls) and CSV files are allowed.'));
    }
  },
});

// ─── GET /api/imports ────────────────────────────────
// List all past imports with stats
router.get('/', async (_req: Request, res: Response) => {
  try {
    const imports = await prisma.leadImport.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        uploadedBy: true,
        totalRows: true,
        processedRows: true,
        skippedRows: true,
        status: true,
        headers: true,
        createdAt: true,
      },
    });
    res.json(imports);
  } catch (error) {
    console.error('GET /api/imports error', error);
    res.status(500).json({ error: 'Failed to fetch imports' });
  }
});

// ─── POST /api/imports/upload ────────────────────────
// Upload an Excel file → parse → store raw rows → return headers for mapping
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Parse the Excel file
    const { headers, rows, totalRows } = parseExcelBuffer(file.buffer, file.originalname);

    // Create the import record
    const leadImport = await prisma.leadImport.create({
      data: {
        fileName: file.originalname,
        uploadedBy: (req.body.uploadedBy as string) || 'admin',
        totalRows,
        status: 'mapping', // Ready for column mapping
        headers,
      },
    });

    // Store each row as raw JSON
    await prisma.leadImportRow.createMany({
      data: rows.map((row, index) => ({
        importId: leadImport.id,
        rowNumber: index + 1,
        rawData: row as any,
        status: 'pending',
      })),
    });

    // Auto-detect column mapping
    const suggestedMapping = autoDetectMapping(headers);

    res.status(201).json({
      importId: leadImport.id,
      fileName: file.originalname,
      totalRows,
      headers,
      suggestedMapping,
      crmFields: CRM_FIELDS,
      previewRows: rows.slice(0, 5), // Send first 5 rows for preview
    });
  } catch (error: any) {
    console.error('POST /api/imports/upload error', error);
    res.status(400).json({ error: error.message || 'Failed to parse file' });
  }
});

// ─── GET /api/imports/:id ────────────────────────────
// Get import details with preview rows for mapping UI
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const importRecord = await prisma.leadImport.findUnique({
      where: { id: req.params.id },
      include: {
        rows: {
          take: 10,
          orderBy: { rowNumber: 'asc' },
        },
      },
    });

    if (!importRecord) {
      res.status(404).json({ error: 'Import not found' });
      return;
    }

    // Auto-detect mapping if not already set
    const suggestedMapping =
      importRecord.columnMapping || autoDetectMapping(importRecord.headers);

    res.json({
      ...importRecord,
      suggestedMapping,
      crmFields: CRM_FIELDS,
    });
  } catch (error) {
    console.error(`GET /api/imports/${req.params.id} error`, error);
    res.status(500).json({ error: 'Failed to fetch import' });
  }
});

// ─── POST /api/imports/:id/map ───────────────────────
// Accept column mapping → transform rows → create Leads
router.post('/:id/map', async (req: Request, res: Response) => {
  try {
    const { columnMapping, sourceName, saveAsTemplate, templateName } = req.body;

    if (!columnMapping || typeof columnMapping !== 'object') {
      res.status(400).json({ error: 'columnMapping is required' });
      return;
    }

    // Fetch the import and all its raw rows
    const importRecord = await prisma.leadImport.findUnique({
      where: { id: req.params.id },
    });

    if (!importRecord) {
      res.status(404).json({ error: 'Import not found' });
      return;
    }

    if (importRecord.status === 'completed') {
      res.status(400).json({ error: 'This import has already been processed' });
      return;
    }

    // Save the column mapping on the import
    await prisma.leadImport.update({
      where: { id: req.params.id },
      data: {
        columnMapping: columnMapping as any,
        status: 'processing',
      },
    });

    // Optionally save as a reusable template
    if (saveAsTemplate && templateName) {
      await prisma.importTemplate.create({
        data: {
          name: templateName,
          sourceName: sourceName || 'Custom',
          columnMapping: columnMapping as any,
        },
      });
    }

    // Fetch all rows in batches for processing
    const allRows = await prisma.leadImportRow.findMany({
      where: { importId: req.params.id },
      orderBy: { rowNumber: 'asc' },
    });

    let processedCount = 0;
    let skippedCount = 0;
    const errors: { rowNumber: number; error: string }[] = [];

    for (const row of allRows) {
      const rawData = row.rawData as Record<string, unknown>;
      const { lead, error } = transformRow(rawData, columnMapping);

      if (error || !lead) {
        skippedCount++;
        await prisma.leadImportRow.update({
          where: { id: row.id },
          data: { status: 'error', errorMsg: error || 'Transform failed' },
        });
        errors.push({ rowNumber: row.rowNumber, error: error || 'Transform failed' });
        continue;
      }

      try {
        // Create the Lead record
        const createdLead = await prisma.lead.create({
          data: {
            name: lead.name,
            phone: lead.phone,
            email: lead.email || null,
            source: sourceName || lead.source || 'Excel Import',
            stage: lead.stage || 'New',
            budget: lead.budget || null,
            project: lead.project || null,
            assignedTo: lead.assignedTo || null,
            tags: lead.tags || [],
            value: lead.value || 0,
            customFields: lead.customFields as any,
            importId: req.params.id,
            createdAt: lead.createdAt || new Date(),
          },
        });

        processedCount++;
        await prisma.leadImportRow.update({
          where: { id: row.id },
          data: { status: 'inserted', leadId: createdLead.id },
        });
      } catch (insertError: any) {
        skippedCount++;
        await prisma.leadImportRow.update({
          where: { id: row.id },
          data: { status: 'error', errorMsg: insertError.message },
        });
        errors.push({ rowNumber: row.rowNumber, error: insertError.message });
      }
    }

    // Update import status
    await prisma.leadImport.update({
      where: { id: req.params.id },
      data: {
        status: 'completed',
        processedRows: processedCount,
        skippedRows: skippedCount,
      },
    });

    res.json({
      status: 'completed',
      totalRows: importRecord.totalRows,
      processedRows: processedCount,
      skippedRows: skippedCount,
      errors: errors.slice(0, 20), // Return first 20 errors at most
    });
  } catch (error) {
    console.error(`POST /api/imports/${req.params.id}/map error`, error);

    // Mark import as failed
    await prisma.leadImport.update({
      where: { id: req.params.id },
      data: { status: 'failed' },
    }).catch(() => {});

    res.status(500).json({ error: 'Failed to process import' });
  }
});

// ─── GET /api/imports/templates ──────────────────────
// List saved import templates
router.get('/templates/list', async (_req: Request, res: Response) => {
  try {
    const templates = await prisma.importTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(templates);
  } catch (error) {
    console.error('GET /api/imports/templates error', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// ─── DELETE /api/imports/:id ─────────────────────────
// Delete an import record and all its rows (cascade)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.leadImport.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/imports/${req.params.id} error`, error);
    res.status(500).json({ error: 'Failed to delete import' });
  }
});

export default router;
