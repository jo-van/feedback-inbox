import { NextResponse } from 'next/server';
import { factoryState, listRequests } from '@/lib/requests';

export const dynamic = 'force-dynamic';

// Feeds the big-screen Factory Floor. Public fields only.
export async function GET() {
  const [requests, factory] = await Promise.all([listRequests(), factoryState()]);
  const tickets = requests.map((r) => ({
      id: r.id, title: r.title, name: r.name, votes: r.votes, stage: r.stage, round: r.round,
      checks: r.checks, publicReason: r.publicReason, createdAt: r.createdAt, updatedAt: r.updatedAt,
    history: r.history, prUrl: r.prUrl, previewUrl: r.previewUrl, seeded: r.seeded,
  }));
  return NextResponse.json({ factory, tickets, now: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
}
