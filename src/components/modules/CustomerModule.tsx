'use client';

import React from 'react';
import { buyerPortalData } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function CustomerModule() {
  const data = buyerPortalData;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Buyer / Customer Portal</h2>
        <p className="text-sm text-[var(--text-muted)]">Secure self-service for your customers — reduces inbound queries</p>
      </div>

      <div className="card p-6 mb-4">
        <div className="text-xs tracking-widest text-[var(--text-muted)]">WELCOME BACK</div>
        <div className="text-3xl font-semibold tracking-tight mt-1">{data.buyerName}</div>
        <div className="text-[var(--text-muted)]">{data.unit}</div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-[var(--text-muted)]">Agreement Value</div>
            <div className="font-semibold text-xl">{formatCurrency(data.agreementValue)}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Amount Paid</div>
            <div className="font-semibold text-xl text-emerald-600">{formatCurrency(data.paid)}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Next Payment Due</div>
            <div className="font-semibold text-xl text-amber-600">{data.nextDue}</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="font-semibold mb-3">Payment Schedule</div>
          {data.payments.map((p, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b last:border-none text-sm">
              <div>{p.date} — {p.type}</div>
              <div className="font-medium">{formatCurrency(p.amount)} <span className="text-xs font-normal text-[var(--text-muted)]">{p.status}</span></div>
            </div>
          ))}
          <button onClick={() => toast.success('Reminder sent to your registered mobile')} className="mt-4 text-xs underline">Request Payment Reminder</button>
        </div>

        <div className="card p-5">
          <div className="font-semibold mb-3">Your Documents</div>
          <ul className="text-sm space-y-2">
            {data.documents.map((d, i) => <li key={i} className="flex justify-between">• {d} <button onClick={() => toast('Secure PDF downloaded')} className="text-xs text-[var(--accent)]">Download</button></li>)}
          </ul>

          <button onClick={() => toast('Construction milestone photos updated')} className="mt-6 text-xs border w-full py-2 rounded">View Construction Progress</button>
          <button onClick={() => toast('Service request submitted')} className="mt-2 text-xs w-full py-2 bg-[var(--accent)] text-white rounded">Submit Service Request</button>
        </div>
      </div>

      <div className="text-center text-xs text-[var(--text-muted)] mt-6">OTP-secured • Auto payment reminders enabled</div>
    </div>
  );
}
