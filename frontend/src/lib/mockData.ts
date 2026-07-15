import { Lead, Agent, Task, Activity, Notification, Unit, PipelineData, RevenueData, Role, LeadStage, Booking, Payment, Document, Campaign, Post, Workflow, Report } from './types';

// Agents
export const agents: Agent[] = [
  { id: 'a1', name: 'Rohan Sharma', role: 'Agent', avatar: 'RS', team: 'North', target: 8500000, achieved: 6120000, calls: 142, visits: 38, bookings: 7 },
  { id: 'a2', name: 'Priya Malhotra', role: 'Agent', avatar: 'PM', team: 'North', target: 7200000, achieved: 6890000, calls: 119, visits: 47, bookings: 9 },
  { id: 'a3', name: 'Amit Verma', role: 'Agent', avatar: 'AV', team: 'South', target: 6800000, achieved: 4210000, calls: 97, visits: 29, bookings: 5 },
  { id: 'a4', name: 'Sneha Kapoor', role: 'Agent', avatar: 'SK', team: 'South', target: 9100000, achieved: 9040000, calls: 156, visits: 51, bookings: 11 },
  { id: 'm1', name: 'Karan Malhotra', role: 'Manager', avatar: 'KM', team: 'North', target: 24000000, achieved: 17220000, calls: 0, visits: 0, bookings: 32 },
  { id: 'm2', name: 'Anjali Rao', role: 'Manager', avatar: 'AR', team: 'South', target: 19500000, achieved: 13250000, calls: 0, visits: 0, bookings: 25 },
];

// Current user simulation
export const currentUsers: Record<Role, { name: string; avatar: string; team?: string }> = {
  Admin: { name: 'Vikram Singh', avatar: 'VS' },
  Manager: { name: 'Karan Malhotra', avatar: 'KM', team: 'North' },
  Agent: { name: 'Rohan Sharma', avatar: 'RS', team: 'North' },
  Finance: { name: 'Meera Patel', avatar: 'MP' },
};

// Leads — rich dataset ~28 leads
export const leads: Lead[] = [
  { id: 'L001', name: 'Arjun Patel', phone: '+91 98765 43210', email: 'arjun.patel@email.com', source: 'Meta Ads', stage: 'Visit', budget: 9200000, project: 'Aether Heights', assignedTo: 'Rohan Sharma', createdAt: '2026-06-10', lastActivity: '2026-06-22', tags: ['Hot', '3BHK'], value: 9800000 },
  { id: 'L002', name: 'Priya Singh', phone: '+91 98234 56789', email: 'priya.singh@email.com', source: 'Website', stage: 'Negotiation', budget: 6500000, project: 'Aether Heights', assignedTo: 'Priya Malhotra', createdAt: '2026-06-12', lastActivity: '2026-06-23', tags: ['Warm'], value: 6750000 },
  { id: 'L003', name: 'Rahul Mehta', phone: '+91 99123 45678', email: 'rahul.mehta@email.com', source: '99acres', stage: 'Booked', budget: 12400000, project: 'Skyline Villas', assignedTo: 'Sneha Kapoor', createdAt: '2026-05-28', lastActivity: '2026-06-21', tags: ['Hot', '4BHK'], value: 13150000 },
  { id: 'L004', name: 'Ananya Gupta', phone: '+91 99876 54321', email: 'ananya.g@email.com', source: 'Google Ads', stage: 'Contacted', budget: 4800000, project: 'Riverfront Residences', assignedTo: 'Amit Verma', createdAt: '2026-06-18', lastActivity: '2026-06-22', tags: ['Warm', '2BHK'], value: 5100000 },
  { id: 'L005', name: 'Vikram Rao', phone: '+91 97654 32109', email: 'vikram.rao@email.com', source: 'Walk-in', stage: 'New', budget: 7900000, project: 'Aether Heights', assignedTo: 'Rohan Sharma', createdAt: '2026-06-23', lastActivity: '2026-06-23', tags: ['Hot'], value: 8150000 },
  { id: 'L006', name: 'Ishita Nair', phone: '+91 98321 09876', email: 'ishita.nair@email.com', source: 'Referral', stage: 'Visit', budget: 11200000, project: 'Skyline Villas', assignedTo: 'Priya Malhotra', createdAt: '2026-06-14', lastActivity: '2026-06-20', tags: ['Hot', 'Penthouse'], value: 14500000 },
  { id: 'L007', name: 'Karan Kapoor', phone: '+91 99456 12345', email: 'karan.k@email.com', source: 'MagicBricks', stage: 'Negotiation', budget: 5600000, project: 'Riverfront Residences', assignedTo: 'Sneha Kapoor', createdAt: '2026-06-09', lastActivity: '2026-06-23', tags: ['Warm'], value: 5800000 },
  { id: 'L008', name: 'Meera Iyer', phone: '+91 98123 76543', email: 'meera.iyer@email.com', source: 'WhatsApp', stage: 'Contacted', budget: 3800000, project: 'Riverfront Residences', assignedTo: 'Amit Verma', createdAt: '2026-06-19', lastActivity: '2026-06-22', tags: ['Cold'], value: 3950000 },
  { id: 'L009', name: 'Siddharth Jain', phone: '+91 97765 43210', email: 'sid.jain@email.com', source: 'Meta Ads', stage: 'New', budget: 10200000, project: 'Aether Heights', assignedTo: 'Rohan Sharma', createdAt: '2026-06-23', lastActivity: '2026-06-23', tags: ['Hot'], value: 10900000 },
  { id: 'L010', name: 'Riya Sharma', phone: '+91 98901 23456', email: 'riya.sharma@email.com', source: 'Google Ads', stage: 'Visit', budget: 7100000, project: 'Skyline Villas', assignedTo: 'Priya Malhotra', createdAt: '2026-06-15', lastActivity: '2026-06-21', tags: ['Warm'], value: 7350000 },
  { id: 'L011', name: 'Aditya Malhotra', phone: '+91 98567 89012', email: 'aditya.m@email.com', source: '99acres', stage: 'Booked', budget: 8900000, project: 'Aether Heights', assignedTo: 'Sneha Kapoor', createdAt: '2026-06-01', lastActivity: '2026-06-18', tags: ['Hot', '3BHK'], value: 9250000 },
  { id: 'L012', name: 'Nisha Reddy', phone: '+91 99012 34567', email: 'nisha.reddy@email.com', source: 'Walk-in', stage: 'Lost', budget: 4500000, project: 'Riverfront Residences', assignedTo: 'Amit Verma', createdAt: '2026-05-20', lastActivity: '2026-06-10', tags: ['Cold'], value: 0 },
  { id: 'L013', name: 'Devansh Bhatia', phone: '+91 97234 56789', email: 'devansh.b@email.com', source: 'Meta Ads', stage: 'Contacted', budget: 13500000, project: 'Skyline Villas', assignedTo: 'Rohan Sharma', createdAt: '2026-06-17', lastActivity: '2026-06-23', tags: ['Hot'], value: 14200000 },
  { id: 'L014', name: 'Tanvi Saxena', phone: '+91 96456 78901', email: 'tanvi.saxena@email.com', source: 'Website', stage: 'Negotiation', budget: 6100000, project: 'Aether Heights', assignedTo: 'Priya Malhotra', createdAt: '2026-06-11', lastActivity: '2026-06-22', tags: ['Warm'], value: 6300000 },
  { id: 'L015', name: 'Kabir Khan', phone: '+91 95555 12345', email: 'kabir.khan@email.com', source: 'Google Ads', stage: 'Visit', budget: 4200000, project: 'Riverfront Residences', assignedTo: 'Sneha Kapoor', createdAt: '2026-06-20', lastActivity: '2026-06-23', tags: ['Warm', '2BHK'], value: 4350000 },
  { id: 'L016', name: 'Aarav Menon', phone: '+91 98888 99999', email: 'aarav.menon@email.com', source: 'Referral', stage: 'New', budget: 15500000, project: 'Skyline Villas', assignedTo: 'Rohan Sharma', createdAt: '2026-06-23', lastActivity: '2026-06-23', tags: ['Hot'], value: 16300000 },
];

// Pipeline summary (calculated from leads)
export const getPipelineData = (filteredLeads: Lead[]): PipelineData[] => {
  const stages: LeadStage[] = ['New', 'Contacted', 'Visit', 'Negotiation', 'Booked', 'Closed', 'Lost'];
  return stages.map((stage, idx) => {
    const stageLeads = filteredLeads.filter(l => l.stage === stage);
    const count = stageLeads.length;
    const value = stageLeads.reduce((sum, l) => sum + l.value, 0);
    // simulated drop off — realistic for demo
    const dropOff = idx > 0 ? Math.round((1 - count / Math.max(1, filteredLeads.filter(l => l.stage === stages[idx-1]).length)) * 100) : undefined;
    return { stage, count, value, dropOff: dropOff && dropOff > 0 ? dropOff : undefined };
  });
};

// Today's tasks (role filtered later)
export const tasks: Task[] = [
  { id: 'T001', title: 'Follow-up call with Arjun Patel', leadId: 'L001', leadName: 'Arjun Patel', due: '2026-06-23T11:00', priority: 'High', completed: false, type: 'Call' },
  { id: 'T002', title: 'Site visit — Priya Singh at Aether Heights', leadId: 'L002', leadName: 'Priya Singh', due: '2026-06-23T14:30', priority: 'High', completed: false, type: 'Visit' },
  { id: 'T003', title: 'Send cost sheet to Devansh Bhatia', leadId: 'L013', leadName: 'Devansh Bhatia', due: '2026-06-23T16:00', priority: 'Medium', completed: false, type: 'Document' },
  { id: 'T004', title: 'Negotiation meeting: Ishita Nair', leadId: 'L006', leadName: 'Ishita Nair', due: '2026-06-24T10:00', priority: 'High', completed: false, type: 'Meeting' },
  { id: 'T005', title: 'Update documents for Aditya Malhotra booking', leadId: 'L011', leadName: 'Aditya Malhotra', due: '2026-06-23T18:00', priority: 'Medium', completed: true, type: 'Document' },
  { id: 'T006', title: 'Call back Vikram Rao — new lead', leadId: 'L005', leadName: 'Vikram Rao', due: '2026-06-23T09:45', priority: 'High', completed: false, type: 'Call' },
];

// Recent activity feed
export const activities: Activity[] = [
  { id: 'act1', timestamp: '2026-06-23T09:41', type: 'StageChange', description: 'Moved Arjun Patel from Contacted → Visit', agent: 'Rohan Sharma', lead: 'Arjun Patel' },
  { id: 'act2', timestamp: '2026-06-23T08:55', type: 'Visit', description: 'Completed site visit with Kabir Khan', agent: 'Sneha Kapoor', lead: 'Kabir Khan' },
  { id: 'act3', timestamp: '2026-06-23T08:12', type: 'WhatsApp', description: 'Sent price list update to Priya Singh', agent: 'Priya Malhotra', lead: 'Priya Singh' },
  { id: 'act4', timestamp: '2026-06-22T19:30', type: 'Booking', description: 'Booking confirmed — Aditya Malhotra (Aether Heights 3BHK)', agent: 'Sneha Kapoor', lead: 'Aditya Malhotra' },
  { id: 'act5', timestamp: '2026-06-22T17:05', type: 'Call', description: '45 min discovery call — Devansh Bhatia', agent: 'Rohan Sharma', lead: 'Devansh Bhatia' },
  { id: 'act6', timestamp: '2026-06-22T14:20', type: 'Payment', description: '₹12.5L received — Rahul Mehta (Skyline Villas)', agent: 'Meera Patel', lead: 'Rahul Mehta' },
];

// Notifications
export const notifications: Notification[] = [
  { id: 'n1', type: 'overdue', title: 'Overdue follow-up', message: 'Meera Iyer has had no activity for 4 days', time: '1h ago', read: false },
  { id: 'n2', type: 'new-lead', title: 'New hot lead', message: 'Siddharth Jain — ₹1.02Cr budget, Meta Ads', time: '38m ago', read: false },
  { id: 'n3', type: 'payment', title: 'Payment received', message: '₹8.9L from Aditya Malhotra', time: 'Yesterday', read: true },
  { id: 'n4', type: 'escalation', title: 'Manager escalation', message: 'Nisha Reddy marked lost — review required', time: 'Yesterday', read: true },
  { id: 'n5', type: 'visit', title: 'Visit scheduled', message: 'Ishita Nair — Skyline Villas, 24 Jun 10am', time: '2d ago', read: true },
];

// Inventory sample (for chatbot & quick stats)
export const units: Unit[] = [
  { id: 'u1', project: 'Aether Heights', tower: 'A', floor: 12, unitNumber: 'A-1203', type: '3BHK', area: 1450, status: 'Available', price: 9800000 },
  { id: 'u2', project: 'Aether Heights', tower: 'B', floor: 8, unitNumber: 'B-804', type: '2BHK', area: 980, status: 'Hold', price: 6350000 },
  { id: 'u3', project: 'Skyline Villas', tower: 'C', floor: 5, unitNumber: 'C-501', type: '4BHK', area: 2210, status: 'Booked', price: 13150000 },
  { id: 'u4', project: 'Aether Heights', tower: 'A', floor: 17, unitNumber: 'A-1701', type: '3BHK', area: 1520, status: 'Available', price: 10750000 },
  { id: 'u5', project: 'Riverfront Residences', tower: 'D', floor: 3, unitNumber: 'D-304', type: '2BHK', area: 875, status: 'Sold', price: 4650000 },
  { id: 'u6', project: 'Skyline Villas', tower: 'C', floor: 14, unitNumber: 'C-1402', type: 'Penthouse', area: 3120, status: 'Available', price: 28500000 },
];

// Revenue target tracker (monthly)
export const revenueData: RevenueData[] = [
  { month: 'Jan', actual: 14200000, target: 13500000 },
  { month: 'Feb', actual: 11900000, target: 13500000 },
  { month: 'Mar', actual: 16700000, target: 14800000 },
  { month: 'Apr', actual: 15400000, target: 14800000 },
  { month: 'May', actual: 18100000, target: 16500000 },
  { month: 'Jun', actual: 13950000, target: 17200000 },
];

// Helper to get filtered data based on role
export function filterDataByRole<T extends { assignedTo?: string }>(data: T[], role: Role, currentAgentName: string): T[] {
  if (role === 'Admin' || role === 'Finance') return data;
  if (role === 'Manager') {
    // manager sees whole team — simple simulation: all for demo, or filter by North/South
    return data;
  }
  // Agent only own leads
  return data.filter((item: any) => !item.assignedTo || item.assignedTo === currentAgentName);
}

export const projects = ['Aether Heights', 'Skyline Villas', 'Riverfront Residences'];

// AI Chatbot knowledge base simulation — intelligent responses
export const quickSuggestions = [
  "Show me all hot leads this week",
  "Which 3BHK units in Aether Heights are available?",
  "Leads with no activity in 5+ days?",
  "My team's conversion rate this month",
  "Write a follow-up WhatsApp for Arjun Patel",
  "Revenue vs target this quarter",
];

// Finance
export const bookings: Booking[] = [
  { id: 'B001', leadId: 'L003', leadName: 'Rahul Mehta', unitId: 'u3', unitNumber: 'C-501', project: 'Skyline Villas', agreementValue: 13150000, bookingDate: '2026-06-01', paymentPlan: 'Construction-linked', status: 'Active' },
  { id: 'B002', leadId: 'L011', leadName: 'Aditya Malhotra', unitId: 'u1', unitNumber: 'A-1203', project: 'Aether Heights', agreementValue: 9250000, bookingDate: '2026-06-18', paymentPlan: 'Flexi 40-60', status: 'Active' },
];

export const payments: Payment[] = [
  { id: 'P001', bookingId: 'B001', leadName: 'Rahul Mehta', amount: 1250000, dueDate: '2026-05-15', paidDate: '2026-05-14', status: 'Paid', mode: 'UPI', receiptNo: 'REC-8821' },
  { id: 'P002', bookingId: 'B001', leadName: 'Rahul Mehta', amount: 2630000, dueDate: '2026-06-20', paidDate: '2026-06-22', status: 'Paid', mode: 'Bank Transfer', receiptNo: 'REC-9012' },
  { id: 'P003', bookingId: 'B002', leadName: 'Aditya Malhotra', amount: 1850000, dueDate: '2026-06-25', status: 'Pending', mode: undefined },
  { id: 'P004', bookingId: 'B002', leadName: 'Aditya Malhotra', amount: 925000, dueDate: '2026-05-01', paidDate: '2026-04-29', status: 'Paid', mode: 'Cheque' },
  { id: 'P005', bookingId: 'B001', leadName: 'Rahul Mehta', amount: 1315000, dueDate: '2026-07-10', status: 'Overdue' },
];

// Documents / Resources
export const documents: Document[] = [
  { id: 'D001', name: 'RERA Certificate - Aether Heights.pdf', type: 'RERA', project: 'Aether Heights', size: '2.4 MB', uploadedAt: '2025-11-12' },
  { id: 'D002', name: 'Master Layout Plan - Skyline.pdf', type: 'Layout', project: 'Skyline Villas', size: '8.1 MB', uploadedAt: '2026-01-05' },
  { id: 'D003', name: 'Price List Rev 3 - June 2026.xlsx', type: 'Price List', project: 'Aether Heights', size: '312 KB', uploadedAt: '2026-06-01' },
  { id: 'D004', name: 'Demand Notice Template.docx', type: 'Template', size: '89 KB', uploadedAt: '2026-04-20' },
  { id: 'D005', name: 'Allotment Letter - Aditya Malhotra.pdf', type: 'Legal', project: 'Aether Heights', size: '1.1 MB', uploadedAt: '2026-06-19' },
];

// Social
export const campaigns: Campaign[] = [
  { id: 'C1', platform: 'Meta', name: 'Aether Heights Launch - June', spend: 184000, impressions: 482000, clicks: 12400, leads: 47, status: 'Active' },
  { id: 'C2', platform: 'Google', name: '3BHK Search - North', spend: 92000, impressions: 189300, clicks: 6700, leads: 21, status: 'Active' },
  { id: 'C3', platform: 'LinkedIn', name: 'Premium Villas - Corporate', spend: 41000, impressions: 68000, clicks: 890, leads: 6, status: 'Paused' },
];

export const scheduledPosts: Post[] = [
  { id: 'P01', platform: 'Meta + Instagram', content: '3BHK ready-to-move in Tower B. Limited units.', scheduledFor: '2026-06-24T10:00', status: 'Scheduled' },
  { id: 'P02', platform: 'LinkedIn', content: 'Why Aether Heights is the smartest investment in 2026.', scheduledFor: '2026-06-25T09:00', status: 'Draft' },
];

// AI Automation
export const workflows: Workflow[] = [
  { id: 'W1', name: 'Hot Lead WhatsApp Auto-Reply', trigger: 'Lead tagged Hot', condition: 'Source = Meta Ads', action: 'Send WhatsApp template + assign to agent', active: true },
  { id: 'W2', name: 'Stage Progression Reminder', trigger: 'Stage = Visit for 3 days', condition: 'No activity', action: 'Notify agent + create follow-up task', active: true },
  { id: 'W3', name: 'SLA Breach Alert', trigger: 'Lead untouched > 48h', condition: 'Stage in New/Contacted', action: 'Escalate to Manager + SMS', active: false },
];

// Analytics reports
export const reports: Report[] = [
  { id: 'R1', name: 'Monthly Sales Summary', type: 'Sales', lastRun: '2026-06-22', schedule: 'Weekly' },
  { id: 'R2', name: 'Lead Source Attribution', type: 'Marketing', lastRun: '2026-06-20', schedule: 'Monthly' },
  { id: 'R3', name: 'Inventory Absorption Report', type: 'Inventory', lastRun: '2026-06-23' },
];

// Customer Portal
export const buyerPortalData = {
  buyerName: 'Rahul Mehta',
  unit: 'C-501, Skyline Villas',
  agreementValue: 13150000,
  paid: 3880000,
  nextDue: '2026-07-10',
  payments: [
    { date: '2026-05-14', amount: 1250000, type: 'Down payment', status: 'Paid' },
    { date: '2026-06-22', amount: 2630000, type: 'Foundation', status: 'Paid' },
    { date: '2026-07-10', amount: 1315000, type: 'Slab', status: 'Due' },
  ],
  documents: ['Allotment Letter', 'Agreement Copy', 'Payment Receipts'],
};

// Add more leads for richer kanban etc.
export const allLeadsFull = [...leads];


