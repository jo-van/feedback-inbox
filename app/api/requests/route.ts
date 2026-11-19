import { NextResponse, type NextRequest } from 'next/server';
import { validateNewRequest } from '@/lib/model';
import { allow, createRequest, listRequests } from '@/lib/requests';
import { saveContact } from '@/lib/contacts';

export const dynamic = 'force-dynamic';

export async function GET() {
  const requests = await listRequests();
  requests.sort((a, b) => b.votes - a.votes || a.id - b.id);
  return NextResponse.json({ requests }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  // Honeypot: real people never fill the hidden "website" field.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true }, { status: 201 });
  }
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!(await allow('submit:all', 400, 600)) || !(await allow('submit:' + ip, 100, 600))) {
    return NextResponse.json({ error: 'Whoa, lots of ideas! Try again in a few minutes.' }, { status: 429 });
  }
  const v = validateNewRequest(body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const created = await createRequest(v.value);
  if (v.value.email && v.value.consent) await saveContact(created.id, v.value.name, v.value.email);
  return NextResponse.json({ request: created }, { status: 201 });
}
