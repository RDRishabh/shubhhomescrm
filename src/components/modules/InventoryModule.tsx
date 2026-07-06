'use client';

import React, { useState } from 'react';
import { Unit } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Building2, Filter } from 'lucide-react';

interface Props {
  units: Unit[];
  onUpdateUnit: (unit: Partial<Unit> & { id: string }) => Promise<void>;
  onDeleteUnit?: (id: string) => Promise<void>;
}

const projects = ['All', 'Aether Heights', 'Skyline Villas', 'Riverfront Residences'];

export default function InventoryModule({ units, onUpdateUnit, onDeleteUnit }: Props) {
  const [projectFilter, setProjectFilter] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const filtered = projectFilter === 'All' ? units : units.filter(u => u.project === projectFilter);

  const grouped = filtered.reduce((acc, u) => {
    const key = `${u.project} • Tower ${u.tower}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(u);
    return acc;
  }, {} as Record<string, Unit[]>);

  const generateCostSheet = (unit: Unit) => {
    const base = unit.price;
    const plc = Math.round(base * 0.08);
    const parking = 450000;
    const gst = Math.round((base + plc + parking) * 0.05);
    const total = base + plc + parking + gst;
    toast.success('Cost Sheet Generated', { description: `${unit.unitNumber} • Total ${formatCurrency(total)}` });
    setSelectedUnit(unit);
  };

  return (
    <div>
      <div className="flex justify-between mb-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Inventory Management</h2>
          <p className="text-sm text-[var(--text-muted)]">Real-time unit availability, pricing &amp; documents</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {projects.map(p => (
            <button key={p} onClick={() => setProjectFilter(p)} className={`px-3 py-1 rounded-full border text-xs ${projectFilter === p ? 'bg-[var(--accent)] text-white' : ''}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([tower, towerUnits]) => (
          <div key={tower} className="card p-5">
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold"><Building2 className="h-4 w-4" /> {tower}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {towerUnits.map(unit => {
                const statusColor = unit.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : unit.status === 'Hold' ? 'bg-amber-100 text-amber-700' : unit.status === 'Booked' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700';
                return (
                  <div key={unit.id} onClick={() => setSelectedUnit(unit)} className="border rounded-xl p-3 text-sm hover:border-[var(--accent)] cursor-pointer">
                    <div className="font-mono font-semibold tracking-tighter">{unit.unitNumber}</div>
                    <div className="text-xs text-[var(--text-muted)]">{unit.type} • {unit.area} sqft • Floor {unit.floor}</div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="font-medium">{formatCurrency(unit.price)}</div>
                      <span className={`px-2 py-px text-[10px] rounded-full ${statusColor}`}>{unit.status}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); generateCostSheet(unit); }} className="text-[10px] mt-3 text-[var(--accent)] hover:underline">Generate Cost Sheet →</button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Cost Sheet / Unit Modal */}
      {selectedUnit && (
        <div className="fixed inset-0 z-[70] bg-black/30 flex items-center justify-center p-4" onClick={() => setSelectedUnit(null)}>
          <div className="card w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between">
              <div>
                <div className="font-semibold text-xl tracking-tight">{selectedUnit.unitNumber}</div>
                <div className="text-sm text-[var(--text-muted)]">{selectedUnit.project} • {selectedUnit.type}</div>
              </div>
              <button onClick={() => setSelectedUnit(null)}>Close</button>
            </div>

            <div className="mt-5 border-t pt-4 text-sm">
              <div className="flex justify-between py-1"><span>Base Price</span><span className="font-medium">{formatCurrency(selectedUnit.price)}</span></div>
              <div className="flex justify-between py-1"><span>PLC (8%)</span><span className="font-medium">{formatCurrency(Math.round(selectedUnit.price * 0.08))}</span></div>
              <div className="flex justify-between py-1"><span>Parking</span><span className="font-medium">₹4,50,000</span></div>
              <div className="flex justify-between py-1"><span>GST (5%)</span><span className="font-medium">{formatCurrency(Math.round((selectedUnit.price * 1.08 + 450000) * 0.05))}</span></div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-1">
                <span>Total Agreement Value</span>
                <span>{formatCurrency(Math.round(selectedUnit.price * 1.08 + 450000 + (selectedUnit.price * 1.08 + 450000) * 0.05))}</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
              <button onClick={() => { onUpdateUnit({ id: selectedUnit.id, status: 'Hold' }); toast.success('Unit put on Hold'); }} className="border py-2 rounded-xl">Put on Hold</button>
              <button onClick={() => { onUpdateUnit({ id: selectedUnit.id, status: 'Available' }); }} className="border py-2 rounded-xl">Release</button>
            </div>

            <div className="mt-3 flex gap-2">
              <button onClick={() => { onUpdateUnit({ id: selectedUnit.id, price: Math.round(selectedUnit.price * 0.95) }); }} className="flex-1 text-xs border py-1.5 rounded">Apply 5% Discount</button>
              {onDeleteUnit && <button onClick={() => { onDeleteUnit(selectedUnit.id); setSelectedUnit(null); }} className="text-xs px-4 text-red-600 border border-red-200 rounded">Delete Unit</button>}
            </div>
            <div className="text-[10px] text-center mt-3 text-[var(--text-muted)]">Auto-calculated cost sheet • RERA compliant</div>
          </div>
        </div>
      )}
    </div>
  );
}
