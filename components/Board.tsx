'use client';

import { useCallback, useEffect, useState } from 'react';
import { type PublicRequest, statusLabel } from '@/lib/model';

function readVoted(): number[] {
  try { return JSON.parse(localStorage.getItem('ff_voted') || '[]'); } catch { return []; }
}

export default function Board() {
  const [requests, setRequests] = useState<PublicRequest[] | null>(null);
  const [voted, setVoted] = useState<number[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/requests', { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      const data = await r.json();
      setRequests(data.requests);
      setError('');
    } catch {
      setError('Could not load requests. Retrying…');
    }
  }, []);

  useEffect(() => {
    setVoted(readVoted());
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  async function upvote(id: number) {
    if (voted.includes(id)) return;
    const next = [...voted, id];
    setVoted(next);
    try { localStorage.setItem('ff_voted', JSON.stringify(next)); } catch {}
    setRequests((rs) => rs && rs.map((r) => (r.id === id ? { ...r, votes: r.votes + 1 } : r)));
    await fetch(`/api/requests/${id}/vote`, { method: 'POST' }).catch(() => {});
  }

  if (requests === null) return <p className="empty">{error || 'Loading…'}</p>;
  const list = [...requests].sort((a, b) => b.id - a.id);
  if (list.length === 0) return <p className="empty">No requests.</p>;

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {list.map((r) => {
        const label = statusLabel(r.stage);
        const mine = voted.includes(r.id);
        return (
          <article className="card" key={r.id} data-testid="request-card">
            <button
              className={'vote' + (mine ? ' voted' : '')}
              onClick={() => upvote(r.id)}
              aria-label={`Upvote request ${r.id}`}
              disabled={mine}
            >
              ▲<span data-testid="votes">{r.votes}</span>
            </button>
            <div>
              <h2>{r.title}</h2>
              {r.details && <p>{r.details}</p>}
              <p><b>Done when:</b> {r.doneWhen}</p>
              <div className="meta">
                <span className={'chip ' + label} data-testid="status">{label}</span>
                #{r.id} · {r.name}{r.seeded ? ' (seeded by presenter)' : ''}
                {r.publicReason && (r.stage === 'rejected' || r.stage === 'needs_human') ? ` · ${r.publicReason}` : ''}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
