'use client';

import React from 'react';
import { Bell, Search, ChevronDown, Menu } from 'lucide-react';
import { Role } from '@/lib/types';
import { currentUsers } from '@/lib/mockData';

interface HeaderProps {
  role: Role;
  onRoleChange: (role: Role) => void;
  onNotificationsClick: () => void;
  unreadCount: number;
  onToggleSidebar?: () => void;
}

const roles: Role[] = ['Admin', 'Manager', 'Agent', 'Finance'];

export default function Header({ role, onRoleChange, onNotificationsClick, unreadCount, onToggleSidebar }: HeaderProps) {
  const user = currentUsers[role];

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur z-40 sticky top-0 flex items-center px-4 lg:px-6">
      <div className="flex items-center justify-between w-full">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="lg:hidden mr-1 p-1.5 -ml-1 rounded hover:bg-[var(--surface-2)]">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <span className="font-semibold tracking-tight text-xl">Command Centre</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] font-mono">LIVE</span>
          </div>
        </div>

        {/* Center search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search leads, units, agents… (⌘K)"
              className="w-full pl-10 pr-4 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-full text-sm focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Role Switcher */}
          <div className="relative group">
            <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] pl-2 pr-1 py-1 text-sm cursor-pointer hover:bg-[var(--surface-2)]">
              <div className="flex items-center gap-2 px-1">
                <div className="w-6 h-6 rounded-full bg-[var(--accent)] text-white text-xs flex items-center justify-center font-medium">
                  {user.avatar}
                </div>
                <div>
                  <div className="font-medium text-sm leading-none">{user.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)] leading-none mt-0.5">{role}</div>
                </div>
              </div>
              <div className="border-l border-[var(--border)] pl-1.5 flex items-center">
                <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              </div>
            </div>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-52 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => onRoleChange(r)}
                  className={`w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm hover:bg-[var(--surface-2)] ${r === role ? 'bg-[var(--surface-2)] font-medium' : ''}`}
                >
                  <div className="w-6 h-6 rounded bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-xs font-semibold">
                    {currentUsers[r].avatar}
                  </div>
                  <div>
                    <div>{currentUsers[r].name}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{r}</div>
                  </div>
                  {r === role && <div className="ml-auto text-[10px] text-[var(--accent)]">Active</div>}
                </button>
              ))}
              <div className="border-t my-1 border-[var(--border)]" />
              <div className="px-4 py-1.5 text-[11px] text-[var(--text-muted)]">Switch role to preview RBAC</div>
            </div>
          </div>

          {/* Notifications */}
          <button 
            onClick={onNotificationsClick}
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--surface-2)] border border-[var(--border)]"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <div className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[9px] font-semibold text-white">
                {unreadCount}
              </div>
            )}
          </button>

          {/* User avatar (compact) */}
          <div className="flex items-center gap-2 pl-2 border-l border-[var(--border)]">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-teal-700 text-white text-xs flex items-center justify-center font-semibold tracking-tight">
              {user.avatar}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
