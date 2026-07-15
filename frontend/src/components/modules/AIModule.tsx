'use client';

import React from 'react';
import { Workflow } from '@/lib/types';
import { workflows } from '@/lib/mockData';
import { toast } from 'sonner';
import AIChatbot from '../dashboard/AIChatbot';
import { Role } from '@/lib/types';

interface Props { role: Role; }

export default function AIModule({ role }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">AI &amp; Automation Engine</h2>
        <p className="text-sm text-[var(--text-muted)]">No-code workflows • Smart triggers • 24/7 chatbot</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="card p-5">
            <div className="font-semibold mb-4">Active Workflows</div>
            {workflows.map((wf: Workflow) => (
              <div key={wf.id} className="mb-3 rounded-xl border p-3 flex justify-between text-sm">
                <div>
                  <div className="font-medium">{wf.name}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">{wf.trigger} → {wf.action}</div>
                </div>
                <button onClick={() => toast(wf.active ? 'Workflow paused' : 'Workflow activated')} className={`text-xs rounded px-3 ${wf.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200'}`}>{wf.active ? 'Active' : 'Paused'}</button>
              </div>
            ))}
            <button onClick={() => toast('Visual builder opened')} className="mt-1 text-xs underline text-[var(--accent)]">+ Create new workflow</button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <AIChatbot role={role} />
        </div>
      </div>

      <div className="text-xs text-[var(--text-muted)]">SLA breach detection, auto-messaging, duplicate merge engine all active.</div>
    </div>
  );
}
