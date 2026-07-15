'use client';

import React from 'react';
import { 
  LayoutDashboard, Users, Building2, UserCog, IndianRupee, 
  Share2, BarChart3, Bot, FolderOpen, MessageSquare, User 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeModule?: string;
  onModuleClick?: (module: string) => void;
  open?: boolean;
  onClose?: () => void;
}

const modules = [
  { id: 'dashboard', label: 'Dashboard & Command Centre', icon: LayoutDashboard },
  { id: 'leads', label: 'Lead & Contact Management', icon: Users },
  { id: 'inventory', label: 'Inventory Management', icon: Building2 },
  { id: 'team', label: 'Team Management', icon: UserCog },
  { id: 'finance', label: 'Finance & Transactions', icon: IndianRupee },
  { id: 'social', label: 'Social Media Management', icon: Share2 },
  { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
  { id: 'ai', label: 'AI & Automation Engine', icon: Bot },
  { id: 'resources', label: 'Resources', icon: FolderOpen },
  { id: 'comm', label: 'Communication Hub', icon: MessageSquare },
  { id: 'customer', label: 'Customer / Buyer Portal', icon: User },
];

export default function Sidebar({ activeModule = 'dashboard', onModuleClick, open = true, onClose }: SidebarProps) {
  return (
    <div className={`${open ? 'flex' : 'hidden'} lg:flex fixed lg:static inset-y-0 left-0 z-[60] w-72 flex-col border-r border-[var(--border)] bg-[var(--surface)] h-screen lg:sticky top-0`}>
      <div className="px-6 py-6 border-b border-[var(--border)] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[var(--accent)] flex items-center justify-center">
            <span className="text-white font-semibold text-xl tracking-[-1.5px]">A</span>
          </div>
          <div>
            <div className="font-semibold text-xl tracking-[-0.6px]">Aether</div>
            <div className="text-[10px] text-[var(--text-muted)] -mt-1">REAL ESTATE CRM</div>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-xl">×</button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="px-3 mb-2 text-[10px] font-semibold tracking-[1px] text-[var(--text-muted)]">MODULES</div>
        
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => onModuleClick?.(mod.id)}
              className={cn(
                "nav-link w-full mb-0.5 text-left justify-start",
                isActive && "active"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{mod.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
        <div>Version 2.4.1 • June 2026</div>
        <div className="mt-1">Enterprise • Multi-project</div>
      </div>
    </div>
  );
}
