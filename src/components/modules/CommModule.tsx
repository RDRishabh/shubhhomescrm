'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

export default function CommModule() {
  const [message, setMessage] = useState('');

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-1">Communication Hub</h2>
      <p className="text-sm text-[var(--text-muted)]">Click-to-call, WhatsApp &amp; email built into the CRM</p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="font-semibold mb-3">Click-to-Call</div>
          <div className="text-xs mb-2">Connected to your softphone / VoIP</div>
          <input placeholder="Search lead or enter number" className="border w-full p-3 rounded-xl text-sm mb-2" />
          <button onClick={() => toast.success('Call started • Recording enabled')} className="w-full bg-emerald-600 text-white py-2 rounded-xl">Call Arjun Patel (+91 98765 43210)</button>
          <div className="text-[10px] mt-3 text-[var(--text-muted)]">Auto-logs call + duration on hang-up</div>
        </div>

        <div className="card p-5">
          <div className="font-semibold mb-3">WhatsApp / Email Composer</div>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message or use template..." className="border p-3 w-full rounded-xl h-28 text-sm" />
          <div className="flex gap-2 mt-2">
            <button onClick={() => { toast.success('Sent via WhatsApp'); setMessage(''); }} className="flex-1 border py-2 text-sm rounded-xl">Send WhatsApp</button>
            <button onClick={() => { toast.success('Email sent'); setMessage(''); }} className="flex-1 py-2 text-sm bg-[var(--accent)] text-white rounded-xl">Send Email</button>
          </div>
          <div className="mt-3 text-xs">Templates: Follow-up Visit • Price Drop Alert • Booking Confirmation</div>
        </div>
      </div>
    </div>
  );
}
