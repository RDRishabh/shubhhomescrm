import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

// GET all units
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM "Unit" ORDER BY project, tower, floor');
    res.json(result.rows);
  } catch (error) {
    console.error('GET /api/units error', error);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

// POST create unit
router.post('/', async (req: Request, res: Response) => {
  try {
    const { project, tower, floor, unitNumber, type, area, status, price } = req.body;
    const result = await query(
      `INSERT INTO "Unit" (project, tower, floor, "unitNumber", type, area, status, price) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [project, tower, floor, unitNumber, type, area, status || 'Available', price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /api/units error', error);
    res.status(500).json({ error: 'Failed to create unit' });
  }
});

// PUT update unit
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const body = req.body;
    const fields = [];
    const vals: any[] = [];
    let i = 1;

    if (body.status) { fields.push(`status = $${i++}`); vals.push(body.status); }
    if (body.price) { fields.push(`price = $${i++}`); vals.push(body.price); }
    if (body.area) { fields.push(`area = $${i++}`); vals.push(body.area); }

    if (!fields.length) {
      res.status(400).json({ error: 'Nothing to update' });
      return;
    }

    vals.push(id);
    const resUpdate = await query(`UPDATE "Unit" SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, vals);
    if (resUpdate.rows.length === 0) {
      res.status(404).json({ error: 'Unit not found' });
      return;
    }
    res.json(resUpdate.rows[0]);
  } catch (error) {
    console.error(`PUT /api/units/${id} error`, error);
    res.status(500).json({ error: 'Failed to update unit' });
  }
});

// DELETE unit
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM "Unit" WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/units/${id} error`, error);
    res.status(500).json({ error: 'Failed to delete unit' });
  }
});

export default router;
