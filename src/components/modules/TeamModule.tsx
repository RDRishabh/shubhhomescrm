'use client';

import React, { useState } from 'react';
import { Agent, Role } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Users, Target } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  agents: Agent[];
  role: Role;
}

export default function TeamModule({ agents, role }: Props) {
  const [selected, setSelected] = useState<Agent | null>(null);

  const agentList = agents.filter(a => a.role === 'Agent');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Team Management</h2>
        <p className="text-sm text-[var(--text-muted)]">Org structure, targets, performance &amp; channel partners</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentList.map(agent => {
          const pct = Math.round((agent.achieved / agent.target) * 100);
          return (
            <div key={agent.id} onClick={() => setSelected(agent)} className="card p-5 cursor-pointer hover:border-[var(--accent)]">
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center text-xl font-semibold flex-none">{agent.avatar}</div>
                <div>
                  <div className="font-semibold">{agent.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{agent.team} Team • {agent.role}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1"><Target className="h-3.5 w-3.5" /> Target</div>
                  <div>{formatCurrency(agent.target)}</div>
                </div>
                <div className="h-1.5 mt-1.5 bg-[var(--surface-2)] rounded overflow-hidden">
                  <div className="h-1.5 bg-[var(--accent)] rounded" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="flex justify-between mt-1 text-xs text-[var(--text-muted)]">
                  <span>{formatCurrency(agent.achieved)}</span>
                  <span className="font-medium text-[var(--text)]">{pct}%</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="bg-[var(--surface-2)] p-2 rounded">Calls: <span className="font-semibold">{agent.calls}</span></div>
                <div className="bg-[var(--surface-2)] p-2 rounded">Visits: <span className="font-semibold">{agent.visits}</span></div>
                <div className="bg-[var(--surface-2)] p-2 rounded">Bookings: <span className="font-semibold">{agent.bookings}</span></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manager view extras */}
      {(role === 'Admin' || role === 'Manager') && (
        <div className="mt-8">
          <div className="card p-5">
            <div className="font-semibold mb-3">Manager Escalation Rules</div>
            <ul className="text-sm space-y-2 text-[var(--text-muted)]">
              <li>• Auto-escalate leads untouched for 48 hrs</li>
              <li>• Missed follow-up alerts sent to reporting manager</li>
              <li>• Target shortfall triggers weekly coaching task</li>
            </ul>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-end lg:items-center justify-center" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg card p-6 lg:rounded-2xl rounded-t-3xl" onClick={e => e.stopPropagation()}>
            <div className="font-semibold text-xl">{selected.name}</div>
            <div className="text-sm text-[var(--text-muted)] mb-4">Performance scorecard — June 2026</div>
            
            <div className="space-y-2 text-sm">
              <div>Target Achievement: {formatCurrency(selected.achieved)} / {formatCurrency(selected.target)}</div>
              <div>Calls: {selected.calls} • Visits: {selected.visits} • Bookings: {selected.bookings}</div>
            </div>

            <button onClick={() => { toast.success('Target adjusted'); setSelected(null); }} className="mt-6 w-full py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm">Set / Adjust Monthly Target</button>
          </div>
        </div>
      )}
    </div>
  );
}
