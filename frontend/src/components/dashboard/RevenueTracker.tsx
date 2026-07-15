'use client';

import React from 'react';
import { RevenueData } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface RevenueTrackerProps {
  data: RevenueData[];
}

export default function RevenueTracker({ data }: RevenueTrackerProps) {
  const latest = data[data.length - 1];
  const progress = Math.round((latest.actual / latest.target) * 100);

  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="font-semibold tracking-tight">Revenue vs Target</div>
          <div className="text-xs text-[var(--text-muted)]">June 2026</div>
        </div>
        <div className="text-right">
          <div className="font-semibold tabular-nums tracking-tight text-xl">{progress}%</div>
          <div className="text-xs text-[var(--text-muted)]">{formatCurrency(latest.actual)} / {formatCurrency(latest.target)}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-[var(--surface-2)] rounded mb-6 overflow-hidden">
        <div className="revenue-bar h-2 bg-gradient-to-r from-[var(--accent)] to-teal-400 rounded" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>

      {/* Trend line */}
      <div className="h-[134px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tickFormatter={(v) => `₹${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip 
              formatter={(v) => [formatCurrency(Number(v) || 0), '']}
              labelStyle={{ color: '#0f172a' }}
            />
            <Line type="natural" dataKey="target" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
            <Line type="natural" dataKey="actual" stroke="#0f766e" strokeWidth={3} dot={{ fill: '#0f766e', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
