// Shared types and pure helpers. No I/O here, so it is easy to unit test.

export type Stage =
  | 'received' | 'spec' | 'build' | 'test' | 'review' | 'security' | 'checks'
  | 'preview' | 'released' | 'rejected' | 'needs_human';

export interface PublicRequest {
  id: number;
  title: string;
  details: string;
  doneWhen: string;
  name: string;
  votes: number;
  stage: Stage;
  round: number;
  publicReason?: string;
  seeded?: boolean;
  createdAt: string;
  updatedAt: string;
  prUrl?: string;
  previewUrl?: string;
  checks?: { review?: 'pending' | 'pass' | 'fail'; security?: 'pending' | 'pass' | 'fail' };
  history?: { stage: Stage; at: string }[];
}

export const LIMITS = { title: 120, details: 1000, doneWhen: 500, name: 40, email: 200 } as const;

const LABELS: Record<Stage, string> = {
  received: 'Received',
  spec: 'Building',
  build: 'Building',
  test: 'Testing',
  review: 'In review',
  security: 'In review',
  checks: 'In review',
  preview: 'Preview',
  released: 'Shipped',
  rejected: 'Not today',
  needs_human: 'Needs a human',
};

export function statusLabel(stage: Stage): string {
  return LABELS[stage] ?? 'Received';
}

/** Remove control characters and collapse whitespace; trim to a max length. */
export function clean(input: unknown, max: number): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .slice(0, max);
}

export interface NewRequestInput {
  title: string;
  details: string;
  doneWhen: string;
  name: string;
  email: string;
  consent: boolean;
}

export type Validation = { ok: true; value: NewRequestInput } | { ok: false; error: string };

export function validateNewRequest(body: Record<string, unknown>): Validation {
  const value: NewRequestInput = {
    title: clean(body.title, LIMITS.title),
    details: clean(body.details, LIMITS.details),
    doneWhen: clean(body.doneWhen, LIMITS.doneWhen),
    name: clean(body.name, LIMITS.name),
    email: clean(body.email, LIMITS.email),
    consent: body.consent === true || body.consent === 'on' || body.consent === 'true',
  };
  if (value.title.length < 4) return { ok: false, error: 'Tell us what you want changed (at least a few words).' };
  if (value.doneWhen.length < 4) return { ok: false, error: 'Tell us how we will know it works.' };
  if (!value.name) return { ok: false, error: 'Add a first name so we can put it on your request.' };
  if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) return { ok: false, error: 'That email does not look right.' };
  if (value.email && !value.consent) return { ok: false, error: 'Tick the box if you want us to follow up by email, or clear the email field.' };
  return { ok: true, value };
}

export function padId(id: number): string {
  return 'REQ#' + String(id).padStart(6, '0');
}
