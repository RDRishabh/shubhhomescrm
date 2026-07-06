'use client';

import React from 'react';
import { Activity } from '@/lib/types';
import { getRelativeTime } from '@/lib/utils';
import { Phone, Users, Mail, MessageSquare, ArrowRight, Calendar, IndianRupee } from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

const iconFor = (type: Activity['type']) => {
  switch (type) {
    case 'Call': return Phone;
    case 'Visit': return Users;
    case 'Email': return Mail;
    case 'WhatsApp': return MessageSquare;
    case 'StageChange': return ArrowRight;
    case 'Booking': return Calendar;
    case 'Payment': return IndianRupee;
    default: return ArrowRight;
  }
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="card p-6">
      <div className="font-semibold tracking-tight mb-4">Recent Activity</div>
      <div className="space-y-0 text-sm">
        {activities.slice(0, 6).map((act, idx) => {
          const Icon = iconFor(act.type);
          return (
            <div key={act.id} className="activity-item flex items-start gap-3 py-[13px] border-b last:border-0 border-[var(--border)]">
              <div className="mt-1 text-[var(--accent)]"><Icon className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="leading-snug">{act.description}</div>
                <div className="mt-1 text-xs text-[var(--text-muted)] flex items-center gap-2">
                  <span>{act.agent}</span> 
                  <span className="text-[9px]">•</span> 
                  <span>{getRelativeTime(act.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
