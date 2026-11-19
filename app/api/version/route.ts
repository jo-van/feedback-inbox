import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    sha: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    env: process.env.VERCEL_ENV || 'local',
    branch: process.env.VERCEL_GIT_COMMIT_REF || '',
  }, { headers: { 'Cache-Control': 'no-store' } });
}
