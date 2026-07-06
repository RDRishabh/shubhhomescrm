'use client';

import React from 'react';
import { Campaign, Post } from '@/lib/types';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

interface Props {
  campaigns: Campaign[];
  posts: Post[];
}

export default function SocialModule({ campaigns, posts }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-1">Social Media Management</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">Multi-platform publishing • Meta/Google lead sync</p>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {campaigns.map(c => (
          <div key={c.id} className="card p-5">
            <div className="flex justify-between">
              <div>
                <div className="uppercase text-xs tracking-[1px] text-[var(--text-muted)]">{c.platform}</div>
                <div className="font-semibold">{c.name}</div>
              </div>
              <div className={`text-xs px-2 h-fit py-0.5 rounded ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100'}`}>{c.status}</div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4 text-xs">
              <div>Spend<br /><span className="font-semibold">{formatCurrency(c.spend)}</span></div>
              <div>Impressions<br /><span className="font-semibold">{(c.impressions / 1000).toFixed(0)}K</span></div>
              <div>Leads<br /><span className="font-semibold">{c.leads}</span></div>
              <div>CPL<br /><span className="font-semibold">{formatCurrency(Math.round(c.spend / Math.max(1, c.leads)))}</span></div>
            </div>
            <button onClick={() => toast('Lead sync enabled')} className="text-xs mt-4 px-3 py-1 border rounded-full">Sync Leads to CRM</button>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="font-semibold mb-4">Content Calendar</div>
        <div className="space-y-3 text-sm">
          {posts.map(p => (
            <div key={p.id} className="flex items-center justify-between border rounded-xl px-4 py-3">
              <div>
                <div>{p.content}</div>
                <div className="text-xs text-[var(--text-muted)]">{p.platform} • {p.scheduledFor}</div>
              </div>
              <button onClick={() => toast.success('Post published / scheduled')} className="text-xs border px-4 py-1 rounded-lg">{p.status}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
