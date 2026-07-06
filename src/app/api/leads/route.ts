import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM "Lead" ORDER BY "createdAt" DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('GET /api/leads error', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, source, stage, budget, project, assignedTo, tags, value } = body;

    const result = await query(
      `INSERT INTO "Lead" (name, phone, email, source, stage, budget, project, "assignedTo", tags, value, "lastActivity") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) 
       RETURNING *`,
      [name, phone, email, source, stage || 'New', budget, project, assignedTo, tags || [], value || budget]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/leads error', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
