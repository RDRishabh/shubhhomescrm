import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const fields = [];
  const vals: any[] = [];
  let i = 1;

  if (body.status) { fields.push(`status = $${i++}`); vals.push(body.status); }
  if (body.price) { fields.push(`price = $${i++}`); vals.push(body.price); }
  if (body.area) { fields.push(`area = $${i++}`); vals.push(body.area); }

  if (!fields.length) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });

  vals.push(id);
  const res = await query(`UPDATE "Unit" SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, vals);
  return NextResponse.json(res.rows[0]);
}

export async function DELETE(_: any, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await query('DELETE FROM "Unit" WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
