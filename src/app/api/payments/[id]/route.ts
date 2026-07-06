import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json();

  if (b.status === 'Paid') {
    const res = await query(
      `UPDATE "Payment" SET status = 'Paid', "paidDate" = NOW(), mode = COALESCE($1, mode) WHERE id = $2 RETURNING *`,
      [b.mode, id]
    );
    return NextResponse.json(res.rows[0]);
  }

  const res = await query('UPDATE "Payment" SET status = $1 WHERE id = $2 RETURNING *', [b.status, id]);
  return NextResponse.json(res.rows[0]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await query('DELETE FROM "Payment" WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
