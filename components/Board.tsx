'use client';

import { useCallback, useEffect, useState } from 'react';
import { type PublicRequest, statusLabel } from '@/lib/model';

function readVoted(): number[] {
  try { return JSON.parse(localStorage.getItem('ff_voted') || '[]'); } catch { return []; }
}

export function relativeAge(createdAt: string, now = Date.now()): string {
  const t = Date.parse(createdAt);
  const diff = now - t;
  if (Number.isNaN(t) || diff < 60000) return 'just now';
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
}

export default function Board() {
  const [requests, setRequests] = useState<PublicRequest[] | null>(null);
  const [voted, setVoted] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'votes'>('newest');
  const [, setTick] = useState(0);

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
    const t = setInterval(() => { setTick((n) => n + 1); load(); }, 5000);
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
  const list = [...requests].sort((a, b) =>
    sort === 'votes' ? (b.votes - a.votes) || (b.id - a.id) : b.id - a.id);
  if (list.length === 0) return <p className="empty">No requests.</p>;
  const q = query.trim().toLowerCase();
  const visible = q ? list.filter((r) => r.title.toLowerCase().includes(q)) : list;

  return (
    <div>
      <input
        type="text"
        data-testid="search"
        aria-label="Search requests by title"
        placeholder="Search by title"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', marginBottom: 12 }}
      />
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          type="button"
          data-testid="sort-newest"
          aria-pressed={sort === 'newest'}
          onClick={() => setSort('newest')}
          style={{ fontWeight: sort === 'newest' ? 700 : 400, border: sort === 'newest' ? '2px solid currentColor' : undefined }}
        >Newest</button>
        <button
          type="button"
          data-testid="sort-votes"
          aria-pressed={sort === 'votes'}
          onClick={() => setSort('votes')}
          style={{ fontWeight: sort === 'votes' ? 700 : 400, border: sort === 'votes' ? '2px solid currentColor' : undefined }}
        >Most votes</button>
      </div>
      {error && <p className="error">{error}</p>}
      {q && visible.length === 0 && <p className="empty" data-testid="no-matches">No matching requests.</p>}
      {visible.map((r) => {
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
                <span data-testid="age" title={Number.isNaN(Date.parse(r.createdAt)) ? '' : new Date(r.createdAt).toISOString()}> · {relativeAge(r.createdAt)}</span>
                {r.publicReason && (r.stage === 'rejected' || r.stage === 'needs_human') ? ` · ${r.publicReason}` : ''}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
