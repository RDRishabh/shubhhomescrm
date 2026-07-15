// Core domain types for Aether CRM Dashboard

export type Role = 'Admin' | 'Manager' | 'Agent' | 'Finance';

export type LeadStage = 'New' | 'Contacted' | 'Visit' | 'Negotiation' | 'Booked' | 'Closed' | 'Lost';

export type LeadSource = 
  | 'Website' 
  | 'Meta Ads' 
  | 'Google Ads' 
  | '99acres' 
  | 'MagicBricks' 
  | 'WhatsApp' 
  | 'Walk-in' 
  | 'Referral';

export type Priority = 'High' | 'Medium' | 'Low';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  stage: LeadStage;
  budget: number;
  project: string;
  assignedTo: string; // agent name
  createdAt: string;
  lastActivity: string;
  tags: string[];
  value: number; // potential or booked value
  whatsapp?: string;
  alternatePhone?: string;
  city?: string;
  preferredContact?: string;
  preferredTime?: string;
  configuration?: string;
  purpose?: string;
  possessionTimeframe?: string;
  financingStatus?: string;
  campaignDetails?: string;
  temperature?: 'Hot' | 'Warm' | 'Cold';
  notes?: string;
  nextAction?: string;
  nextFollowUp?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  team?: string;
  target: number; // monthly revenue target
  achieved: number;
  calls: number;
  visits: number;
  bookings: number;
}

export interface Task {
  id: string;
  title: string;
  leadId?: string;
  leadName?: string;
  due: string;
  priority: Priority;
  completed: boolean;
  type: 'Call' | 'Visit' | 'Follow-up' | 'Document' | 'Meeting';
}

export interface Activity {
  id: string;
  timestamp: string;
  type: 'Call' | 'Visit' | 'Email' | 'WhatsApp' | 'StageChange' | 'Booking' | 'Payment';
  description: string;
  agent: string;
  lead?: string;
}

export interface Notification {
  id: string;
  type: 'overdue' | 'new-lead' | 'payment' | 'escalation' | 'visit';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Unit {
  id: string;
  project: string;
  tower: string;
  floor: number;
  unitNumber: string;
  type: string; // 2BHK etc
  area: number;
  status: 'Available' | 'Hold' | 'Booked' | 'Sold';
  price: number;
}

export interface PipelineData {
  stage: LeadStage;
  count: number;
  value: number;
  dropOff?: number; // % drop
}

export interface RevenueData {
  month: string;
  actual: number;
  target: number;
}

// For AI Chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  data?: any;
}

// Additional module types
export interface Booking {
  id: string;
  leadId: string;
  leadName: string;
  unitId: string;
  unitNumber: string;
  project: string;
  agreementValue: number;
  bookingDate: string;
  paymentPlan: string;
  status: 'Active' | 'Cancelled';
}

export interface Payment {
  id: string;
  bookingId: string;
  leadName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  mode?: string;
  receiptNo?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  project?: string;
  size: string;
  uploadedAt: string;
  url?: string;
  sharedLink?: string;
}

export interface Campaign {
  id: string;
  platform: 'Meta' | 'LinkedIn' | 'Google';
  name: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  status: 'Active' | 'Paused' | 'Completed';
}

export interface Post {
  id: string;
  platform: string;
  content: string;
  scheduledFor: string;
  status: 'Draft' | 'Scheduled' | 'Published';
}

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  active: boolean;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  lastRun: string;
  schedule?: string;
}

export interface ServiceRequest {
  id: string;
  buyer: string;
  unit: string;
  type: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  created: string;
}
