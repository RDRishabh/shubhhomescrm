import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

// GET all documents
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM "Document" ORDER BY "uploadedAt" DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('GET /api/documents error', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// POST create document
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, type, project, size } = req.body;
    const result = await query(
      `INSERT INTO "Document" (name, type, project, size) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, type, project || null, size || '1 MB']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /api/documents error', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// DELETE document
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM "Document" WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/documents/${id} error`, error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
