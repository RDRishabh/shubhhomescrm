'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  onClick?: () => void;
}

export default function KpiCard({ label, value, change, trend = 'neutral', icon, onClick }: KpiCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "kpi-tile card p-5 flex flex-col justify-between min-h-[118px] cursor-pointer select-none",
        onClick && "card-interactive"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="text-sm font-medium text-[var(--text-muted)]">{label}</div>
        {icon && <div className="text-[var(--accent)] opacity-70">{icon}</div>}
      </div>

      <div>
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="kpi-value text-4xl font-semibold tracking-[-1.6px] tabular-nums mt-1"
        >
          {value}
        </motion.div>
        
        {change && (
          <div className={cn(
            "mt-1.5 flex items-center gap-1 text-xs font-medium",
            trend === 'up' && "text-[var(--success)]",
            trend === 'down' && "text-[var(--danger)]"
          )}>
            {trend === 'up' && <TrendingUp className="h-3.5 w-3.5" />}
            {trend === 'down' && <TrendingDown className="h-3.5 w-3.5" />}
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
