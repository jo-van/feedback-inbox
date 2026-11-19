'use client';

import { useState } from 'react';
import { LIMITS } from '@/lib/model';

export default function NewRequestForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<number | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(f.entries());
    try {
      const r = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, consent: f.get('consent') === 'on' }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Something went wrong.');
      setDone(data.request?.id ?? 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (done !== null) {
    return (
      <div>
        <p className="ok">Thanks! Your request is #{done}.</p>
        <p>Ask your neighbors to upvote it. The factory picks the most-wanted ideas it can build safely.</p>
        <a className="btn" href="/">See all requests</a>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="title">What should we change or fix?</label>
      <input id="title" name="title" type="text" maxLength={LIMITS.title} required placeholder="e.g. Let me filter to only shipped requests" />

      <label htmlFor="details">Anything else? <span className="hint">(optional)</span></label>
      <textarea id="details" name="details" maxLength={LIMITS.details} />

      <label htmlFor="doneWhen">How will we know it works?</label>
      <textarea id="doneWhen" name="doneWhen" maxLength={LIMITS.doneWhen} required placeholder="e.g. When I tap 'Shipped', I only see shipped requests" />

      <label htmlFor="name">First name <span className="hint">(shown on your request)</span></label>
      <input id="name" name="name" type="text" maxLength={LIMITS.name} required />

      <label htmlFor="email">Email <span className="hint">(optional, never shown publicly)</span></label>
      <input id="email" name="email" type="email" maxLength={LIMITS.email} />
      <label className="check">
        <input type="checkbox" name="consent" />
        <span>Send me how this was built / I&apos;d like to talk about a software factory for my company.</span>
      </label>

      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && <p className="error">{error}</p>}
      <p><button className="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send it to the factory'}</button>{' '}
      <a className="btn secondary" href="/">Cancel</a></p>
    </form>
  );
}
