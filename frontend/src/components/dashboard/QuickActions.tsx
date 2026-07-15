'use client';

import React from 'react';
import { Plus, Calendar, Upload, Users } from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export default function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    { id: 'add-lead', label: 'Add New Lead', icon: Plus, desc: 'Capture enquiry' },
    { id: 'schedule-visit', label: 'Schedule Visit', icon: Calendar, desc: 'Book site tour' },
    { id: 'upload-doc', label: 'Upload Property Doc', icon: Upload, desc: 'RERA / brochure' },
    { id: 'bulk-message', label: 'Bulk Message', icon: Users, desc: 'Segmented outreach' },
  ];

  return (
    <div className="card p-6">
      <div className="font-semibold tracking-tight mb-4">Quick Actions</div>
      <div className="grid grid-cols-1 gap-2">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              onClick={() => onAction(a.id)}
              className="quick-action text-left"
            >
              <div className="h-9 w-9 flex-none rounded-lg border flex items-center justify-center bg-[var(--surface-2)]">
                <Icon className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div>
                <div className="font-medium text-sm">{a.label}</div>
                <div className="text-xs text-[var(--text-muted)]">{a.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
