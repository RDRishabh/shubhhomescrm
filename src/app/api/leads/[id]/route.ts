import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const result = await query('SELECT * FROM "Lead" WHERE id = $1', [id]);
    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
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

    if (fields.length === 1) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

    const sql = `UPDATE "Lead" SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    values.push(id);

    const result = await query(sql, values);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await query('DELETE FROM "Lead" WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
