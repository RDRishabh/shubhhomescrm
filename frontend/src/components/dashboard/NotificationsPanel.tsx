'use client';

import React from 'react';
import { Notification } from '@/lib/types';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationsPanelProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

const typeLabel: Record<Notification['type'], string> = {
  overdue: 'Overdue',
  'new-lead': 'New Lead',
  payment: 'Payment',
  escalation: 'Escalation',
  visit: 'Visit',
};

export default function NotificationsPanel({ notifications, isOpen, onClose, onMarkRead }: NotificationsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] lg:absolute lg:inset-auto lg:top-14 lg:right-4 lg:w-96">
      <div className="lg:modal-overlay lg:bg-black/30 absolute inset-0 lg:inset-auto lg:rounded-xl" onClick={onClose} />
      
      <div className="absolute right-0 top-0 lg:top-0 w-full max-w-md lg:w-96 bg-[var(--surface)] border border-[var(--border)] rounded-b-2xl lg:rounded-2xl shadow-2xl z-10">
        <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b">
          <div className="font-semibold">Notifications</div>
          <button onClick={onClose} className="text-[var(--text-muted)]"><X className="h-4 w-4" /></button>
        </div>

        <div className="max-h-[400px] overflow-auto divide-y divide-[var(--border)]">
          {notifications.length === 0 && <div className="p-6 text-center text-sm text-[var(--text-muted)]">All caught up.</div>}
          
          {notifications.map((n) => (
            <div key={n.id} onClick={() => onMarkRead(n.id)} className="px-5 py-4 hover:bg-[var(--surface-2)] cursor-pointer flex gap-3">
              <div className={cn("mt-1 h-2 w-2 rounded-full flex-none mt-2", 
                !n.read ? "bg-[var(--accent)]" : "bg-[var(--border)]")} />
              <div className="flex-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{n.title}</span>
                  <span className="text-[10px] px-1.5 py-px bg-[var(--surface-2)] rounded text-[var(--text-muted)]">{typeLabel[n.type]}</span>
                </div>
                <div className="text-[var(--text-muted)] text-sm mt-px">{n.message}</div>
                <div className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
