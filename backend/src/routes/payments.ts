import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

// GET all payments
router.get('/', async (req: Request, res: Response) => {
  try {
    const resSelect = await query('SELECT * FROM "Payment" ORDER BY "dueDate"');
    res.json(resSelect.rows);
  } catch (error) {
    console.error('GET /api/payments error', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// POST create payment
router.post('/', async (req: Request, res: Response) => {
  try {
    const { bookingId, leadName, amount, dueDate, status, mode } = req.body;
    const resInsert = await query(
      `INSERT INTO "Payment" ("bookingId", "leadName", amount, "dueDate", status, mode) 
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [bookingId, leadName, amount, dueDate, status || 'Pending', mode || null]
    );
    res.status(201).json(resInsert.rows[0]);
  } catch (error) {
    console.error('POST /api/payments error', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// PUT update payment
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { status, mode } = req.body;

    if (status === 'Paid') {
      const resUpdate = await query(
        `UPDATE "Payment" SET status = 'Paid', "paidDate" = NOW(), mode = COALESCE($1, mode) WHERE id = $2 RETURNING *`,
        [mode, id]
      );
      if (resUpdate.rows.length === 0) {
        res.status(404).json({ error: 'Payment not found' });
        return;
      }
      res.json(resUpdate.rows[0]);
      return;
    }

    const resUpdate = await query('UPDATE "Payment" SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (resUpdate.rows.length === 0) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }
    res.json(resUpdate.rows[0]);
  } catch (error) {
    console.error(`PUT /api/payments/${id} error`, error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// DELETE payment
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM "Payment" WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/payments/${id} error`, error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

export default router;
