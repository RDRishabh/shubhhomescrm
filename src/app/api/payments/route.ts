import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const res = await query('SELECT * FROM "Payment" ORDER BY "dueDate"');
  return NextResponse.json(res.rows);
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const res = await query(
    `INSERT INTO "Payment" ("bookingId", "leadName", amount, "dueDate", status, mode) 
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [b.bookingId, b.leadName, b.amount, b.dueDate, b.status || 'Pending', b.mode || null]
  );
  return NextResponse.json(res.rows[0], { status: 201 });
}
