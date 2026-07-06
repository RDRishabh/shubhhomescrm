import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function seed() {
  console.log('Seeding via pg...');

  await pool.query(`
    INSERT INTO "Lead" (id, name, phone, email, source, stage, budget, project, "assignedTo", tags, value, "createdAt", "lastActivity", "updatedAt") 
    VALUES ('LCRUDM1', 'Mobile CRUD Lead', '+91 9000000001', 'mobile@crud.test', 'Website', 'New', 6500000, 'Aether Heights', 'Rohan Sharma', ARRAY['Hot'], 6800000, NOW(), NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, stage = EXCLUDED.stage;
  `);

  await pool.query(`
    INSERT INTO "Unit" (id, project, tower, floor, "unitNumber", type, area, status, price, "createdAt", "updatedAt") 
    VALUES ('UCRUD1', 'Aether Heights', 'A', 8, 'A-803', '2BHK', 920, 'Available', 6100000, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log('Seed complete. Test lead LCRUDM1 and unit UCRUD1 ready.');
  await pool.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
