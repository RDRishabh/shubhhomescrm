import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { leads as mockLeads, units as mockUnits, bookings as mockBookings, payments as mockPayments, documents as mockDocuments, agents as mockAgents, workflows as mockWorkflows, campaigns as mockCampaigns } from '../src/lib/mockData';

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing (for dev reset)
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.document.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.campaign.deleteMany();

  // Leads
  for (const l of mockLeads) {
    await prisma.lead.create({
      data: {
        id: l.id,
        name: l.name,
        phone: l.phone,
        email: l.email,
        source: l.source,
        stage: l.stage,
        budget: l.budget,
        project: l.project,
        assignedTo: l.assignedTo,
        createdAt: new Date(l.createdAt),
        lastActivity: new Date(l.lastActivity),
        tags: l.tags,
        value: l.value,
      },
    });
  }

  // Units
  for (const u of mockUnits) {
    await prisma.unit.create({
      data: {
        id: u.id,
        project: u.project,
        tower: u.tower,
        floor: u.floor,
        unitNumber: u.unitNumber,
        type: u.type,
        area: u.area,
        status: u.status,
        price: u.price,
      },
    });
  }

  // Bookings
  for (const b of mockBookings) {
    await prisma.booking.create({
      data: {
        id: b.id,
        leadId: b.leadId,
        leadName: b.leadName,
        unitId: b.unitId,
        unitNumber: b.unitNumber,
        project: b.project,
        agreementValue: b.agreementValue,
        bookingDate: new Date(b.bookingDate),
        paymentPlan: b.paymentPlan,
        status: b.status,
      },
    });
  }

  // Payments
  for (const p of mockPayments) {
    await prisma.payment.create({
      data: {
        id: p.id,
        bookingId: p.bookingId,
        leadName: p.leadName,
        amount: p.amount,
        dueDate: new Date(p.dueDate),
        paidDate: p.paidDate ? new Date(p.paidDate) : null,
        status: p.status,
        mode: p.mode || null,
        receiptNo: p.receiptNo || null,
      },
    });
  }

  // Documents
  for (const d of mockDocuments) {
    await prisma.document.create({
      data: {
        id: d.id,
        name: d.name,
        type: d.type,
        project: d.project || null,
        size: d.size,
        uploadedAt: new Date(d.uploadedAt),
      },
    });
  }

  // Agents
  for (const a of mockAgents) {
    await prisma.agent.create({
      data: {
        id: a.id,
        name: a.name,
        role: a.role,
        avatar: a.avatar,
        team: a.team || null,
        target: a.target,
        achieved: a.achieved,
        calls: a.calls,
        visits: a.visits,
        bookings: a.bookings,
      },
    });
  }

  // Workflows
  for (const w of mockWorkflows) {
    await prisma.workflow.create({
      data: {
        id: w.id,
        name: w.name,
        trigger: w.trigger,
        condition: w.condition,
        action: w.action,
        active: w.active,
      },
    });
  }

  // Campaigns
  for (const c of mockCampaigns) {
    await prisma.campaign.create({
      data: {
        id: c.id,
        platform: c.platform,
        name: c.name,
        spend: c.spend,
        impressions: c.impressions,
        clicks: c.clicks,
        leads: c.leads,
        status: c.status,
      },
    });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
