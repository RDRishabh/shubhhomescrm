'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Phone, Mail, Calendar, ArrowRight, X } from 'lucide-react';
import { Lead, LeadStage, Role } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import AddLeadModal from '@/components/dashboard/AddLeadModal';

interface LeadsModuleProps {
  leads: Lead[];
  role: Role;
  onUpdateLead: (lead: Partial<Lead> & { id: string }) => Promise<void>;
  onAddLead: (lead: any) => Promise<void>;
  onDeleteLead?: (id: string) => Promise<void>;
}

const stages: LeadStage[] = ['New', 'Contacted', 'Visit', 'Negotiation', 'Booked', 'Closed', 'Lost'];

export default function LeadsModule({ leads, role, onUpdateLead, onAddLead, onDeleteLead }: LeadsModuleProps) {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<LeadStage | 'All'>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [kanbanView, setKanbanView] = useState(true);

  const filtered = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || 
                          l.phone.includes(search) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'All' || l.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  // Kanban data
  const kanbanData = stages.map(stage => ({
    stage,
    leads: filtered.filter(l => l.stage === stage)
  }));

  const moveLeadStage = (leadId: string, newStage: LeadStage) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const updated = { ...lead, stage: newStage, lastActivity: new Date().toISOString().split('T')[0] };
    onUpdateLead(updated);
    toast.success(`Moved to ${newStage}`);
  };

  const handleQuickStage = (lead: Lead, dir: 1 | -1) => {
    const idx = stages.indexOf(lead.stage);
    const newIdx = Math.max(0, Math.min(stages.length - 1, idx + dir));
    moveLeadStage(lead.id, stages[newIdx]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Lead &amp; Contact Management</h2>
          <p className="text-sm text-[var(--text-muted)]">Full lifecycle CRM • {leads.length} total in view</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setKanbanView(!kanbanView)} className="px-4 py-2 text-sm border rounded-lg hover:bg-[var(--surface-2)]">
            {kanbanView ? 'Table View' : 'Kanban View'}
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="h-4 w-4" /> New Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, email..." className="w-full pl-9 py-2 bg-[var(--surface)] border rounded-xl text-sm" />
        </div>

        <div className="flex items-center gap-2">
          {['All', ...stages].map(s => (
            <button key={s} onClick={() => setStageFilter(s as any)} className={`px-3 py-1 text-xs rounded-full border transition ${stageFilter === s ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'hover:bg-[var(--surface-2)]'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* KANBAN */}
      {kanbanView && (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {kanbanData.map(({ stage, leads: stageLeads }) => (
            <div key={stage} className="bg-[var(--surface-2)] rounded-2xl p-3 min-h-[380px] border border-[var(--border)]">
              <div className="font-semibold text-xs uppercase tracking-widest px-1 mb-2 flex justify-between">
                {stage} <span className="font-mono text-[var(--text-muted)]">{stageLeads.length}</span>
              </div>
              <div className="space-y-2">
                {stageLeads.map(lead => (
                  <div key={lead.id} onClick={() => setSelectedLead(lead)} className="bg-white border rounded-xl p-3 cursor-pointer active:scale-[0.985] text-sm">
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">{lead.project} • {formatCurrency(lead.budget)}</div>
                    <div className="flex gap-1 mt-2">
                      <button onClick={(e) => { e.stopPropagation(); handleQuickStage(lead, -1); }} className="text-[10px] px-2 py-0.5 border rounded">←</button>
                      <button onClick={(e) => { e.stopPropagation(); handleQuickStage(lead, 1); }} className="text-[10px] px-2 py-0.5 border rounded">→</button>
                    </div>
                    <div className="text-[10px] mt-2 text-[var(--accent)]">{lead.assignedTo}</div>
                  </div>
                ))}
                {stageLeads.length === 0 && <div className="text-xs text-center text-[var(--text-muted)] py-6">No leads</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {!kanbanView && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-2)] text-left">
              <tr>
                <th className="p-4">Contact</th>
                <th className="p-4">Source</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Budget</th>
                <th className="p-4">Assigned</th>
                <th className="p-4">Last Activity</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(lead => (
                <tr key={lead.id} className="hover:bg-[var(--surface-2)]">
                  <td className="p-4 font-medium cursor-pointer" onClick={() => setSelectedLead(lead)}>{lead.name}<div className="text-xs text-[var(--text-muted)]">{lead.phone}</div></td>
                  <td className="p-4 text-xs">{lead.source}</td>
                  <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs stage-${lead.stage.toLowerCase()}`}>{lead.stage}</span></td>
                  <td className="p-4 tabular-nums font-medium">{formatCurrency(lead.budget)}</td>
                  <td className="p-4 text-xs">{lead.assignedTo}</td>
                  <td className="p-4 text-xs text-[var(--text-muted)]">{lead.lastActivity}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setSelectedLead(lead)} className="text-[var(--accent)] text-xs flex items-center gap-1">View <ArrowRight className="h-3 w-3"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 360 Profile Drawer */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-[70] flex justify-end bg-black/30" onClick={() => setSelectedLead(null)}>
            <motion.div 
              initial={{ x: 80, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: 80, opacity: 0 }}
              className="w-full max-w-md bg-[var(--surface)] h-full overflow-y-auto p-6 border-l"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedLead(null)} className="absolute top-4 right-4"><X /></button>

              <div className="mb-6">
                <div className="text-xs tracking-[1px] text-[var(--text-muted)]">360° PROFILE</div>
                <h3 className="text-3xl font-semibold tracking-tight mt-1">{selectedLead.name}</h3>
                <div className="text-[var(--text-muted)] text-sm">{selectedLead.email} • {selectedLead.phone}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                <div className="card p-3"><div className="text-xs text-muted">Stage</div><div className="font-medium">{selectedLead.stage}</div></div>
                <div className="card p-3"><div className="text-xs text-muted">Budget</div><div className="font-medium">{formatCurrency(selectedLead.budget)}</div></div>
                <div className="card p-3"><div className="text-xs text-muted">Source</div><div className="font-medium">{selectedLead.source}</div></div>
                <div className="card p-3"><div className="text-xs text-muted">Project</div><div className="font-medium">{selectedLead.project}</div></div>
              </div>

              <div className="mb-5">
                <div className="uppercase text-xs tracking-widest mb-2">Quick Actions</div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => { toast.success('Call initiated'); }} className="flex-1 py-2 border rounded-xl flex items-center justify-center gap-2 text-sm"><Phone className="h-4 w-4"/> Call</button>
                  <button onClick={() => { toast.success('WhatsApp opened'); }} className="flex-1 py-2 border rounded-xl flex items-center justify-center gap-2 text-sm"><Mail className="h-4 w-4"/> WhatsApp</button>
                  <button onClick={() => { toast.success('Visit scheduled'); setSelectedLead(null); }} className="flex-1 py-2 border rounded-xl flex items-center justify-center gap-2 text-sm"><Calendar className="h-4 w-4"/> Schedule Visit</button>
                </div>
              </div>

              <div>
                <div className="uppercase text-xs tracking-widest mb-2">Update Stage</div>
                <div className="flex flex-wrap gap-2">
                  {stages.map(s => (
                    <button key={s} onClick={() => { moveLeadStage(selectedLead.id, s); setSelectedLead({ ...selectedLead, stage: s }); }} className={`text-xs px-3 py-1 rounded-full border ${selectedLead.stage === s ? 'bg-[var(--accent)] text-white' : ''}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div>
                  <label className="text-xs">Edit Name</label>
                  <input value={selectedLead.name} onChange={(e) => setSelectedLead({ ...selectedLead, name: e.target.value })} className="w-full border p-2 rounded text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs">Budget</label>
                    <input type="number" value={selectedLead.budget} onChange={(e) => setSelectedLead({ ...selectedLead, budget: +e.target.value })} className="w-full border p-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="text-xs">Project</label>
                    <input value={selectedLead.project} onChange={(e) => setSelectedLead({ ...selectedLead, project: e.target.value })} className="w-full border p-2 rounded text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={() => { const { id, ...rest } = selectedLead; onUpdateLead({ id, ...rest }); setSelectedLead(null); }} className="flex-1 py-2 bg-[var(--accent)] text-white rounded-xl text-sm">Save Changes</button>
                {onDeleteLead && <button onClick={() => { onDeleteLead(selectedLead.id); setSelectedLead(null); }} className="px-4 border text-red-600 rounded-xl text-sm">Delete</button>}
              </div>

              <div className="mt-8 pt-6 border-t text-xs text-[var(--text-muted)]">
                Tags: {selectedLead.tags.join(', ')}<br />Assigned to {selectedLead.assignedTo}<br />Created {selectedLead.createdAt}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detailed Slide-in Add Lead Drawer */}
      <AddLeadModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onLeadAdded={(leadData) => {
          if (leadData) {
            onAddLead(leadData);
          }
        }}
      />
    </div>
  );
}
