import { NextResponse, type NextRequest } from 'next/server';
import { allow, vote } from '@/lib/requests';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) return NextResponse.json({ error: 'Bad id' }, { status: 400 });
  let voter = req.cookies.get('ff_voter')?.value;
  const fresh = !voter;
  if (!voter) voter = crypto.randomUUID();
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!(await allow('vote:' + ip, 1000, 600))) return NextResponse.json({ error: 'Too many votes' }, { status: 429 });
  let votes: number | null;
  try {
    votes = await vote(n, voter);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const res = NextResponse.json({ votes, already: votes === null });
  if (fresh) res.cookies.set('ff_voter', voter, { httpOnly: true, sameSite: 'lax', secure: true, maxAge: 60 * 60 * 24 * 30, path: '/' });
  return res;
}
