'use client';

import React, { useState } from 'react';
import { Booking, Payment } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface Props {
  bookings: Booking[];
  payments: Payment[];
  onCreatePayment?: (p: any) => Promise<void>;
  onUpdatePayment?: (id: string, updates: any) => Promise<void>;
  onDeletePayment?: (id: string) => Promise<void>;
}

export default function FinanceModule({ bookings, payments, onUpdatePayment, onDeletePayment }: Props) {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Overdue'>('All');
  const filteredPayments = payments.filter(p => filter === 'All' ? true : p.status === filter);

  const totalOutstanding = payments.filter(p => p.status !== 'Paid').reduce((s, p) => s + p.amount, 0);

  const generateInvoice = (p: Payment) => {
    toast.success('GST Invoice generated', { description: `INV-${p.id} • ${formatCurrency(p.amount)}` });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Finance &amp; Transaction Management</h2>
          <p className="text-sm text-[var(--text-muted)]">Collections, demand notices, commissions &amp; accounting sync</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-[var(--text-muted)]">Outstanding</div>
          <div className="text-3xl font-semibold text-rose-600 tabular-nums tracking-tight">{formatCurrency(totalOutstanding)}</div>
        </div>
      </div>

      {/* Bookings summary */}
      <div className="mb-6">
        <div className="font-semibold mb-3">Active Bookings</div>
        <div className="grid md:grid-cols-2 gap-3">
          {bookings.map(b => (
            <div key={b.id} className="card p-4 flex justify-between text-sm">
              <div>
                <div className="font-medium">{b.leadName}</div>
                <div className="text-xs text-[var(--text-muted)]">{b.unitNumber} • {b.project}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold tabular-nums">{formatCurrency(b.agreementValue)}</div>
                <div className="text-xs text-emerald-600">{b.paymentPlan}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="card">
        <div className="flex items-center gap-3 border-b px-5 py-3 text-sm">
          <div className="font-semibold">Payment Schedule &amp; Receipts</div>
          <div className="ml-auto flex gap-2 text-xs">
            {(['All', 'Pending', 'Overdue'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'text-[var(--accent)] font-medium' : ''}>{f}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--text-muted)] border-b">
                <th className="p-4">Buyer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Due / Paid</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPayments.map(p => (
                <tr key={p.id}>
                  <td className="p-4 font-medium">{p.leadName}</td>
                  <td className="p-4 font-semibold tabular-nums">{formatCurrency(p.amount)}</td>
                  <td className="p-4 text-xs text-[var(--text-muted)]">{p.dueDate} {p.paidDate && `• Paid ${p.paidDate}`}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${p.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : p.status === 'Overdue' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
                  </td>
                  <td className="p-4">
                    {p.status !== 'Paid' && (
                      <>
                        <button onClick={() => onUpdatePayment?.(p.id, { status: 'Paid', mode: 'UPI' })} className="text-xs px-3 py-1 border rounded mr-1">Mark Paid</button>
                        <button onClick={() => generateInvoice(p)} className="text-xs px-3 py-1 border rounded">Invoice</button>
                      </>
                    )}
                    {p.status === 'Paid' && <button onClick={() => toast('Receipt downloaded')} className="text-xs text-[var(--accent)]">Receipt</button>}
                    {onDeletePayment && p.status !== 'Paid' && <button onClick={() => onDeletePayment(p.id)} className="text-xs ml-2 text-red-500">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-xs text-[var(--text-muted)] px-5 py-4 border-t">Auto-generated GST invoices • Ready for Tally / Zoho sync</div>
      </div>
    </div>
  );
}
