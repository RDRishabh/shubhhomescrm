'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { Users, Target, CalendarCheck, IndianRupee, ArrowRight } from 'lucide-react';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import KpiCard from '@/components/dashboard/KpiCard';
import PipelineFunnel from '@/components/dashboard/PipelineFunnel';
import TaskList from '@/components/dashboard/TaskList';
import Leaderboard from '@/components/dashboard/Leaderboard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import RevenueTracker from '@/components/dashboard/RevenueTracker';
import AIChatbot from '@/components/dashboard/AIChatbot';
import QuickActions from '@/components/dashboard/QuickActions';
import NotificationsPanel from '@/components/dashboard/NotificationsPanel';
import AddLeadModal from '@/components/dashboard/AddLeadModal';

// Module components
import LeadsModule from '@/components/modules/LeadsModule';
import InventoryModule from '@/components/modules/InventoryModule';
import TeamModule from '@/components/modules/TeamModule';
import FinanceModule from '@/components/modules/FinanceModule';
import SocialModule from '@/components/modules/SocialModule';
import AnalyticsModule from '@/components/modules/AnalyticsModule';
import AIModule from '@/components/modules/AIModule';
import ResourcesModule from '@/components/modules/ResourcesModule';
import CommModule from '@/components/modules/CommModule';
import CustomerModule from '@/components/modules/CustomerModule';

import { Role, LeadStage, Lead, Task, Unit, Booking, Payment } from '@/lib/types';
import { 
  tasks as allTasks, 
  agents, 
  activities, 
  notifications as initialNotifications, 
  revenueData, 
  getPipelineData,
  currentUsers,
  filterDataByRole,
  campaigns,
  scheduledPosts,
} from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';

export default function AetherDashboard() {
  // Central state for live data across modules
  const [role, setRole] = useState<Role>('Manager');
  const [selectedStage, setSelectedStage] = useState<LeadStage | null>(null);
  const [tasks, setTasks] = useState<Task[]>(allTasks);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [showAddLead, setShowAddLead] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // DB-backed data (loaded from Neon)
  const [leads, setLeads] = useState<Lead[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  const currentUser = currentUsers[role];

  // RBAC-aware filtered data
  const filteredLeads = useMemo(() => {
    let result = filterDataByRole(leads, role, currentUser.name);
    if (selectedStage) {
      result = result.filter(l => l.stage === selectedStage);
    }
    return result;
  }, [leads, role, currentUser.name, selectedStage]);

  const pipeline = useMemo(() => getPipelineData(filteredLeads), [filteredLeads]);

  const totalLeads = filteredLeads.length;
  const pipelineValue = filteredLeads.reduce((sum, l) => sum + l.value, 0);

  // Shared handlers - now hit real API + refresh
  const updateLead = async (updatedLead: Partial<Lead> & { id: string }) => {
    await fetch(`/api/leads/${updatedLead.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLead),
    });
    await loadLeads();
  };

  const addNewLead = async (newLead: Omit<Lead, 'id' | 'createdAt' | 'lastActivity'>) => {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead),
    });
    await loadLeads();
  };

  const updateUnit = async (updated: Partial<Unit> & { id: string }) => {
    await fetch(`/api/units/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    await loadUnits();
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    await loadLeads();
  };

  const deleteUnit = async (id: string) => {
    if (!confirm('Delete this unit?')) return;
    await fetch(`/api/units/${id}`, { method: 'DELETE' });
    await loadUnits();
  };

  const createPayment = async (p: any) => {
    await fetch('/api/payments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
    await loadPayments();
  };

  const updatePayment = async (id: string, updates: any) => {
    await fetch(`/api/payments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    await loadPayments();
  };

  const deletePayment = async (id: string) => {
    if (!confirm('Delete this payment record?')) return;
    await fetch(`/api/payments/${id}`, { method: 'DELETE' });
    await loadPayments();
  };

  const createDocument = async (d: any) => {
    await fetch('/api/documents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
    await loadDocuments();
  };

  const deleteDocument = async (id: string) => {
    await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    await loadDocuments();
  };

  // Visible agents for leaderboard
  const visibleAgents = role === 'Agent' 
    ? agents.filter(a => a.name === currentUser.name) 
    : agents;

  // Load data from API (DB)
  const loadLeads = async () => {
    const res = await fetch('/api/leads');
    if (res.ok) setLeads(await res.json());
  };

  const loadUnits = async () => {
    const res = await fetch('/api/units');
    if (res.ok) setUnits(await res.json());
  };

  const loadPayments = async () => {
    const res = await fetch('/api/payments');
    if (res.ok) setPayments(await res.json());
  };

  const loadDocuments = async () => {
    const res = await fetch('/api/documents');
    if (res.ok) setDocuments(await res.json());
  };

  useEffect(() => {
    loadLeads();
    loadUnits();
    loadPayments();
    loadDocuments();
  }, []);

  // Live tasks filtered by role
  const visibleTasks = useMemo(() => {
    let t = tasks;
    if (role === 'Agent') {
      const myLeads = filteredLeads.map(l => l.id);
      t = t.filter(task => !task.leadId || myLeads.includes(task.leadId));
    }
    return t;
  }, [tasks, role, filteredLeads]);

  // Handlers
  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setSelectedStage(null); // reset filter
    toast.success(`Switched to ${newRole} view`, { description: 'Data & AI responses now respect your permissions.' });
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      toast.success('Task completed', { description: task.title });
    }
  };

  const handleStageClick = (stage: LeadStage) => {
    if (selectedStage === stage) {
      setSelectedStage(null);
    } else {
      setSelectedStage(stage);
      toast.info(`Filtered to ${stage} stage`, { description: `${filteredLeads.filter(l => l.stage === stage).length} leads` });
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'add-lead') {
      setShowAddLead(true);
      setSelectedStage(null);
    } else if (action === 'schedule-visit') {
      toast.success('Visit scheduled', { description: 'Calendar event created. Lead notified via WhatsApp.' });
    } else if (action === 'upload-doc') {
      toast('Document uploaded', { description: 'Added to project vault. RERA compliant.' });
    } else {
      toast('Bulk message sent', { description: 'Queued for 18 segmented contacts.' });
    }
  };

  const handleTaskClick = (task: Task) => {
    toast.info('Task details', { description: `${task.title} • Due ${new Date(task.due).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // KPI array (Dashboard only)
  const kpis = [
    { 
      label: "Total Leads", 
      value: totalLeads, 
      change: selectedStage ? `Filtered: ${selectedStage}` : "+14 this week", 
      trend: 'up' as const, 
      icon: <Users className="h-4 w-4" /> 
    },
    { 
      label: "Pipeline Value", 
      value: formatCurrency(pipelineValue), 
      change: "+8.4% MoM", 
      trend: 'up' as const, 
      icon: <Target className="h-4 w-4" /> 
    },
    { 
      label: "Bookings (M)", 
      value: filteredLeads.filter(l => l.stage === 'Booked' || l.stage === 'Closed').length, 
      change: "3 this week", 
      trend: 'up' as const, 
      icon: <CalendarCheck className="h-4 w-4" /> 
    },
    { 
      label: "Revenue Collected", 
      value: formatCurrency(13950000), 
      change: "81% of target", 
      trend: 'neutral' as const, 
      icon: <IndianRupee className="h-4 w-4" /> 
    },
  ];

  // Full original Dashboard view (extracted to function)
  const renderDashboard = () => (
    <>
      {/* Welcome + role indicator */}
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-[-1.8px]">Good morning, {currentUser.name.split(' ')[0]}.</h1>
            <span className="role-pill bg-[var(--accent)]/10 text-[var(--accent)]">{role}</span>
          </div>
          <p className="text-[var(--text-muted)] mt-0.5">Here&apos;s what needs your attention today across your scope.</p>
        </div>
        {selectedStage && (
          <button onClick={() => setSelectedStage(null)} className="text-sm flex items-center gap-1 text-[var(--accent)] hover:underline">
            Clear stage filter <ArrowRight className="rotate-180 h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {kpis.map((kpi, idx) => (
          <KpiCard 
            key={idx} 
            {...kpi} 
            value={kpi.value} 
            onClick={idx === 0 ? () => setSelectedStage(null) : undefined} 
          />
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Pipeline Funnel — full width */}
        <div className="xl:col-span-12">
          <PipelineFunnel 
            data={pipeline} 
            onStageClick={handleStageClick} 
            selectedStage={selectedStage} 
          />
        </div>

        {/* Tasks + Leaderboard row */}
        <div className="xl:col-span-5">
          <TaskList 
            tasks={visibleTasks} 
            onToggleComplete={handleToggleTask} 
            onTaskClick={handleTaskClick} 
          />
        </div>

        <div className="xl:col-span-4">
          <Leaderboard agents={visibleAgents} currentUser={currentUser.name} />
        </div>

        <div className="xl:col-span-3">
          <QuickActions onAction={handleQuickAction} />
        </div>

        {/* Revenue + Activity */}
        <div className="xl:col-span-5">
          <RevenueTracker data={revenueData} />
        </div>

        <div className="xl:col-span-4">
          <ActivityFeed activities={activities} />
        </div>


      </div>
    </>
  );



  // Render current module
  const renderModule = () => {
    switch (activeModule) {
      case 'leads':
        return <LeadsModule leads={filteredLeads} role={role} onUpdateLead={updateLead} onAddLead={addNewLead} onDeleteLead={deleteLead} />;
      case 'inventory':
        return <InventoryModule units={units} onUpdateUnit={updateUnit} onDeleteUnit={deleteUnit} />;
      case 'team':
        return <TeamModule agents={agents} role={role} />;
      case 'finance':
        return <FinanceModule bookings={[]} payments={payments} onCreatePayment={createPayment} onUpdatePayment={updatePayment} onDeletePayment={deletePayment} />;
      case 'social':
        return <SocialModule campaigns={campaigns} posts={scheduledPosts} />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'ai':
        return <AIModule role={role} />;
      case 'resources':
        return <ResourcesModule documents={documents} onCreate={createDocument} onDelete={deleteDocument} />;
      case 'comm':
        return <CommModule />;
      case 'customer':
        return <CustomerModule />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex dashboard-container min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeModule={activeModule} 
        onModuleClick={(m) => { setActiveModule(m); setMobileSidebarOpen(false); }} 
        open={mobileSidebarOpen || undefined} 
        onClose={() => setMobileSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          role={role} 
          onRoleChange={handleRoleChange} 
          onNotificationsClick={() => setShowNotifications(!showNotifications)} 
          unreadCount={unreadCount} 
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <div className="flex-1 p-5 lg:p-7 max-w-[1480px] mx-auto w-full">
          {renderModule()}
        </div>
      </div>

      {/* Notifications Overlay */}
      <NotificationsPanel 
        notifications={notifications} 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
        onMarkRead={handleMarkRead} 
      />

      {/* Floating AI Chatbot */}
      <AIChatbot role={role} />

      {/* Add Lead Slide-in Right Drawer (shared) */}
      <AddLeadModal 
        isOpen={showAddLead} 
        onClose={() => setShowAddLead(false)} 
        onLeadAdded={() => {
          setSelectedStage(null);
          loadLeads();
        }} 
      />
    </div>
  );
}
