import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const res = await query('SELECT * FROM "Document" ORDER BY "uploadedAt" DESC');
  return NextResponse.json(res.rows);
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const res = await query(
    `INSERT INTO "Document" (name, type, project, size) VALUES ($1, $2, $3, $4) RETURNING *`,
    [b.name, b.type, b.project || null, b.size || '1 MB']
  );
  return NextResponse.json(res.rows[0], { status: 201 });
}
