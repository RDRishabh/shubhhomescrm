import * as XLSX from 'xlsx';

export interface ParsedExcel {
  headers: string[];
  rows: Record<string, unknown>[];
  totalRows: number;
}

/**
 * Parse an Excel (.xlsx, .xls) or CSV file buffer into headers + row objects.
 * Each row is a plain JSON object keyed by column header.
 */
export function parseExcelBuffer(buffer: Buffer, originalName: string): ParsedExcel {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });

  // Use the first sheet
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('The uploaded file contains no sheets.');
  }

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error('Could not read the first sheet.');
  }

  // Convert sheet to JSON — each row becomes an object keyed by header
  const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: null,    // Use null for empty cells
    raw: false,      // Return formatted strings (dates, numbers)
  });

  if (rawRows.length === 0) {
    throw new Error('The uploaded file contains no data rows.');
  }

  // Extract headers from the first row's keys
  const headers = Object.keys(rawRows[0]);

  // Clean up headers: trim whitespace
  const cleanedHeaders = headers.map((h) => h.trim());

  // Re-key rows with cleaned headers
  const rows = rawRows.map((row) => {
    const cleanedRow: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      cleanedRow[key.trim()] = value;
    }
    return cleanedRow;
  });

  return {
    headers: cleanedHeaders,
    rows,
    totalRows: rows.length,
  };
}
