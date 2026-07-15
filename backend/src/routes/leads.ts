import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

// GET all leads
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM "Lead" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('GET /api/leads error', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// GET specific lead
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM "Lead" WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`GET /api/leads/${id} error`, error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// POST create lead
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, source, stage, budget, project, assignedTo, tags, value } = req.body;
    const result = await query(
      `INSERT INTO "Lead" (name, phone, email, source, stage, budget, project, "assignedTo", tags, value, "lastActivity") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) 
       RETURNING *`,
      [name, phone, email, source, stage || 'New', budget, project, assignedTo, tags || [], value || budget]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /api/leads error', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// PUT update lead
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const body = req.body;
    const fields = [];
    const values: any[] = [];
    let idx = 1;

    if (body.stage !== undefined) { fields.push(`stage = $${idx++}`); values.push(body.stage); }
    if (body.name !== undefined) { fields.push(`name = $${idx++}`); values.push(body.name); }
    if (body.phone !== undefined) { fields.push(`phone = $${idx++}`); values.push(body.phone); }
    if (body.email !== undefined) { fields.push(`email = $${idx++}`); values.push(body.email); }
    if (body.budget !== undefined) { fields.push(`budget = $${idx++}`); values.push(body.budget); }
    if (body.project !== undefined) { fields.push(`project = $${idx++}`); values.push(body.project); }
    if (body.assignedTo !== undefined) { fields.push(`"assignedTo" = $${idx++}`); values.push(body.assignedTo); }
    if (body.tags !== undefined) { fields.push(`tags = $${idx++}`); values.push(body.tags); }
    if (body.value !== undefined) { fields.push(`value = $${idx++}`); values.push(body.value); }

    fields.push(`"lastActivity" = NOW()`);

    if (fields.length === 1) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    const sql = `UPDATE "Lead" SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    values.push(id);

    const result = await query(sql, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`PUT /api/leads/${id} error`, error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// DELETE lead
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM "Lead" WHERE id = $1 RETURNING *', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/leads/${id} error`, error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

export default router;
