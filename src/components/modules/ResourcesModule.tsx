'use client';

import React, { useState } from 'react';
import { Document } from '@/lib/types';
import { documents } from '@/lib/mockData';
import { toast } from 'sonner';

interface Props {
  documents?: any[];
  onCreate?: (doc: any) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export default function ResourcesModule({ documents = [], onCreate, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = documents.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-2">Resources</h2>
      <p className="text-sm text-[var(--text-muted)] mb-4">Centralised legal, RERA, marketing collateral with RBAC + expiring links</p>

      <div className="flex gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." className="flex-1 p-2 border rounded-xl text-sm" />
        {onCreate && <button onClick={() => setShowAdd(true)} className="px-4 bg-[var(--accent)] text-white rounded-xl text-sm">+ Upload</button>}
      </div>

      <div className="card divide-y">
        {filtered.map(doc => (
          <div key={doc.id} className="px-5 py-3 flex justify-between text-sm items-center hover:bg-[var(--surface-2)]">
            <div>
              <div className="font-medium">{doc.name}</div>
              <div className="text-xs text-[var(--text-muted)]">{doc.project || 'Global'} • {doc.size}</div>
            </div>
            <div className="flex gap-2 text-xs">
              <button onClick={() => toast('Secure link copied (expires in 7 days)')} className="px-3 py-1 border rounded">Share</button>
              <button onClick={() => toast.success('Downloaded')} className="px-3 py-1 bg-[var(--accent)] text-white rounded">Download</button>
              {onDelete && <button onClick={() => onDelete(doc.id)} className="px-2 text-red-500">×</button>}
            </div>
          </div>
        ))}
      </div>

      {showAdd && onCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[90]" onClick={() => setShowAdd(false)}>
          <div className="card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h4 className="font-semibold mb-3">Add Document</h4>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as any;
              await onCreate({
                name: form.name.value,
                type: form.type.value,
                project: form.project.value || null,
                size: '1.2 MB'
              });
              setShowAdd(false);
              toast.success('Document added');
            }}>
              <input name="name" placeholder="Document name" required className="w-full mb-2 p-2 border rounded" />
              <input name="type" placeholder="Type (RERA, Layout...)" className="w-full mb-2 p-2 border rounded" />
              <input name="project" placeholder="Project (optional)" className="w-full mb-2 p-2 border rounded" />
              <button className="w-full mt-2 py-2 bg-[var(--accent)] text-white rounded">Add Document</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
