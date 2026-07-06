'use client';

import React from 'react';
import { Agent } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Trophy } from 'lucide-react';

interface LeaderboardProps {
  agents: Agent[];
  currentUser?: string;
}

export default function Leaderboard({ agents, currentUser }: LeaderboardProps) {
  const sorted = [...agents]
    .filter(a => a.role === 'Agent')
    .sort((a, b) => b.bookings - a.bookings || b.achieved - a.achieved);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold tracking-tight flex items-center gap-2">
          <Trophy className="h-4 w-4" /> Team Leaderboard
        </div>
        <div className="text-xs text-[var(--text-muted)]">This month</div>
      </div>

      <div className="space-y-3">
        {sorted.map((agent, index) => {
          const pct = Math.round((agent.achieved / agent.target) * 100);
          const isCurrent = currentUser?.includes(agent.name.split(' ')[0]);
          
          return (
            <div key={agent.id} className={isCurrent ? "bg-[var(--surface-2)] -mx-1 px-2 py-1 rounded-xl" : ""}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-3">
                  <div className="text-xs w-5 font-mono text-[var(--text-muted)]">{index + 1}</div>
                  <div className="h-7 w-7 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-xs font-semibold">
                    {agent.avatar}
                  </div>
                  <div className="text-sm font-medium">
                    {agent.name} {isCurrent && <span className="text-[10px] text-[var(--accent)]">(you)</span>}
                  </div>
                </div>
                <div className="text-right text-xs tabular-nums">
                  <span className="font-medium">{agent.bookings}</span> 
                  <span className="text-[var(--text-muted)]"> bookings</span>
                </div>
              </div>
              
              <div className="h-1.5 w-full bg-[var(--surface-2)] rounded overflow-hidden">
                <div 
                  className="h-1.5 rounded bg-gradient-to-r from-[var(--accent)] to-teal-400 transition-all" 
                  style={{ width: `${Math.min(pct, 100)}%` }} 
                />
              </div>
              <div className="flex justify-between text-[10px] mt-0.5 text-[var(--text-muted)] font-mono">
                <span>{formatCurrency(agent.achieved)}</span>
                <span>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
