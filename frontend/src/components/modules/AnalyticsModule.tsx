'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { reports } from '@/lib/mockData';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

const sourceData = [
  { name: 'Meta Ads', value: 47 }, { name: 'Website', value: 32 }, { name: 'Google', value: 21 }, { name: '99acres', value: 14 }, { name: 'Referral', value: 9 }
];
const COLORS = ['#0f766e', '#14b8a6', '#3b82f6', '#f59e0b', '#64748b'];

export default function AnalyticsModule() {
  return (
    <div>
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Analytics &amp; Reports</h2>
          <p className="text-sm text-[var(--text-muted)]">Drag-and-drop builder • Scheduled delivery</p>
        </div>
        <button onClick={() => toast('Custom report exported as Excel')} className="text-sm border px-4 py-2 rounded-lg">Export All</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <div className="font-semibold mb-3">Leads by Source</div>
          <div className="h-[240px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {sourceData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="font-semibold mb-3">Agent Performance (Bookings)</div>
          <div className="h-[240px]">
            <ResponsiveContainer>
              <BarChart data={[{ name: 'Rohan', bookings: 7 }, { name: 'Priya', bookings: 9 }, { name: 'Sneha', bookings: 11 }, { name: 'Amit', bookings: 5 }]}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#0f766e" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card mt-5 p-6">
        <div className="font-semibold mb-4">Saved Reports &amp; Scheduled Delivery</div>
        <div className="divide-y">
          {reports.map(r => (
            <div key={r.id} className="py-3 flex justify-between items-center text-sm">
              <div>
                <div>{r.name}</div>
                <div className="text-xs text-[var(--text-muted)]">Last run: {r.lastRun} {r.schedule && `• ${r.schedule}`}</div>
              </div>
              <button onClick={() => toast.success('Report sent to email')} className="text-xs px-4 py-1.5 border rounded">Run / Schedule</button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-[var(--text-muted)]">Custom report builder available in full version (no-code)</div>
      </div>
    </div>
  );
}
