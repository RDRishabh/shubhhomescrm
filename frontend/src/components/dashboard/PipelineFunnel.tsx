'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PipelineData, LeadStage } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PipelineFunnelProps {
  data: PipelineData[];
  onStageClick?: (stage: LeadStage) => void;
  selectedStage?: LeadStage | null;
}

const stageColors: Record<LeadStage, string> = {
  'New': '#0ea5e9',
  'Contacted': '#3b82f6',
  'Visit': '#6366f1',
  'Negotiation': '#f59e0b',
  'Booked': '#10b981',
  'Closed': '#059669',
  'Lost': '#dc2626',
};

export default function PipelineFunnel({ data, onStageClick, selectedStage }: PipelineFunnelProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const totalLeads = data.reduce((s, d) => s + d.count, 0);
  const bookedValue = data.find(d => d.stage === 'Booked')?.value || 0;

  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="font-semibold tracking-tight">Pipeline Funnel</div>
          <div className="text-sm text-[var(--text-muted)]">{totalLeads} active leads • {formatCurrency(bookedValue)} booked</div>
        </div>

      </div>

      <div className="space-y-2.5">
        {data.map((item, index) => {
          const widthPercent = Math.max((item.count / maxCount) * 100, 8);
          const isSelected = selectedStage === item.stage;
          const isDrop = item.dropOff && item.dropOff > 35;
          
          return (
            <div
              key={item.stage}
              onClick={() => onStageClick?.(item.stage)}
              className={cn(
                "funnel-stage group cursor-pointer flex items-center gap-4 rounded-xl p-1.5 pl-3 hover:bg-[var(--surface-2)]",
                isSelected && "ring-1 ring-offset-2 ring-[var(--accent)] bg-[var(--surface-2)]"
              )}
            >
              <div className="w-[118px] shrink-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.stage}</span>
                  <span className="font-mono tabular-nums text-[var(--text-muted)]">{item.count}</span>
                </div>
              </div>

              <div className="flex-1 relative h-8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1], delay: index * 0.03 }}
                  className="funnel-bar absolute top-1/2 -translate-y-1/2 h-6"
                  style={{ 
                    backgroundColor: stageColors[item.stage],
                    width: `${widthPercent}%` 
                  }}
                />
                
                {/* Value label */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white/90 mix-blend-luminosity pr-1 hidden md:block">
                  {formatCurrency(item.value)}
                </div>
              </div>

              {/* AI drop-off highlight */}
              {item.dropOff && item.dropOff > 20 && (
                <div className={cn("text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap", 
                  isDrop ? "bg-red-100 text-red-700 ai-highlight" : "bg-amber-100 text-amber-700")}>
                  -{item.dropOff}% drop
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
        <div>Click any stage to filter the dashboard</div>
      </div>
    </div>
  );
}
