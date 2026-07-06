'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Phone, Users, FileText, Calendar } from 'lucide-react';
import { Task } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onTaskClick?: (task: Task) => void;
}

const typeIcon = {
  Call: Phone,
  Visit: Users,
  'Follow-up': Clock,
  Document: FileText,
  Meeting: Calendar,
};

export default function TaskList({ tasks, onToggleComplete, onTaskClick }: TaskListProps) {
  const incomplete = tasks.filter(t => !t.completed);
  const complete = tasks.filter(t => t.completed);

  return (
    <div className="card p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-semibold tracking-tight">Today&apos;s Tasks</div>
          <div className="text-xs text-[var(--text-muted)]">{incomplete.length} remaining • Smart prioritised</div>
        </div>
        <div className="text-xs px-3 py-1 bg-[var(--surface-2)] rounded-full text-[var(--text-muted)] font-mono">
          {tasks.length} total
        </div>
      </div>

      <div className="space-y-1 flex-1 overflow-auto pr-1">
        <AnimatePresence>
          {incomplete.length === 0 && (
            <div className="text-sm py-4 text-[var(--text-muted)]">All tasks complete. Great job!</div>
          )}
          {incomplete.map((task, idx) => {
            const Icon = typeIcon[task.type] || Clock;
            return (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: idx * 0.015 }}
                onClick={() => onTaskClick?.(task)}
                className="task-item group flex items-center gap-3 px-3 py-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/60 cursor-pointer"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }}
                  className="h-6 w-6 flex-none rounded-md border flex items-center justify-center text-white hover:bg-[var(--accent)] border-[var(--border)] transition-colors bg-white"
                >
                  <Check className="h-3.5 w-3.5 text-[var(--accent)] group-hover:text-white" />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm leading-tight">{task.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                    {task.leadName && <span>{task.leadName}</span>}
                    <span>•</span>
                    <span>{formatDateTime(task.due)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={cn("px-2 py-px text-[10px] rounded font-medium", 
                    task.priority === 'High' ? "bg-red-100 text-red-700" : 
                    task.priority === 'Medium' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                  )}>{task.priority}</div>
                  <div className="text-[var(--accent)]"><Icon className="h-4 w-4" /></div>
                </div>
              </motion.div>
            );
          })}

          {complete.length > 0 && (
            <div className="pt-3 mt-2 text-xs font-medium text-[var(--text-muted)] border-t">Completed</div>
          )}
          {complete.map(task => (
            <div key={task.id} className="flex items-center gap-3 px-3 py-2 opacity-60 text-sm line-through">
              <div className="h-5 w-5 rounded bg-emerald-500 text-white flex items-center justify-center">
                <Check className="h-3 w-3" />
              </div>
              {task.title}
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
