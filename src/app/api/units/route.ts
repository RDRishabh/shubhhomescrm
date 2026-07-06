import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const result = await query('SELECT * FROM "Unit" ORDER BY project, tower, floor');
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { project, tower, floor, unitNumber, type, area, status, price } = body;

  const result = await query(
    `INSERT INTO "Unit" (project, tower, floor, "unitNumber", type, area, status, price) 
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [project, tower, floor, unitNumber, type, area, status || 'Available', price]
  );
  return NextResponse.json(result.rows[0], { status: 201 });
}
