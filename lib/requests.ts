import { createHash } from 'node:crypto';
import { GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, TABLE } from './db';
import { type NewRequestInput, type PublicRequest, padId } from './model';

const PUBLIC_FIELDS = [
  'id', 'title', 'details', 'doneWhen', 'name', 'votes', 'stage', 'round', 'publicReason',
  'seeded', 'createdAt', 'updatedAt', 'prUrl', 'previewUrl', 'checks', 'history',
] as const;

/** Only ever return whitelisted fields to the public. */
export function toPublic(item: Record<string, unknown>): PublicRequest {
  const out: Record<string, unknown> = {};
  for (const k of PUBLIC_FIELDS) if (item[k] !== undefined) out[k] = item[k];
  return out as unknown as PublicRequest;
}

export async function listRequests(): Promise<PublicRequest[]> {
  const items: Record<string, unknown>[] = [];
  let ExclusiveStartKey: Record<string, unknown> | undefined;
  do {
    const r = await ddb.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': 'REQ' },
      ExclusiveStartKey,
    }));
    items.push(...((r.Items ?? []) as Record<string, unknown>[]));
    ExclusiveStartKey = r.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (ExclusiveStartKey);
  const mask = process.env.FF_MASK_UNSCREENED === '1';
  return items
    .filter((i) => !i.hidden)
    .map((i) => (mask && i.stage === 'received' && !i.screened && !i.seeded
      ? { ...i, title: 'New idea (being screened…)', details: '', doneWhen: 'The Gatekeeper is reading it.' }
      : i))
    .map(toPublic);
}

async function nextId(): Promise<number> {
  const r = await ddb.send(new UpdateCommand({
    TableName: TABLE,
    Key: { pk: 'META', sk: 'COUNTER' },
    UpdateExpression: 'ADD #n :one',
    ExpressionAttributeNames: { '#n': 'n' },
    ExpressionAttributeValues: { ':one': 1 },
    ReturnValues: 'UPDATED_NEW',
  }));
  return Number(r.Attributes?.n ?? 1);
}

export async function createRequest(input: NewRequestInput): Promise<PublicRequest> {
  const id = await nextId();
  const now = new Date().toISOString();
  const item = {
    pk: 'REQ',
    sk: padId(id),
    id,
    title: input.title,
    details: input.details,
    doneWhen: input.doneWhen,
    name: input.name,
    hasContact: Boolean(input.email),
    votes: 1,
    stage: 'received',
    round: 0,
    source: 'app',
    createdAt: now,
    updatedAt: now,
    history: [{ stage: 'received', at: now }],
  };
  await ddb.send(new PutCommand({ TableName: TABLE, Item: item, ConditionExpression: 'attribute_not_exists(pk)' }));
  return toPublic(item);
}

export function hash(value: string): string {
  return createHash('sha256').update('ff:' + value).digest('hex').slice(0, 32);
}

/** One vote per browser per request. Returns the new vote count, or null if already voted. */
export async function vote(id: number, voter: string): Promise<number | null> {
  try {
    await ddb.send(new PutCommand({
      TableName: TABLE,
      Item: { pk: `VOTE#${id}`, sk: hash(voter), at: new Date().toISOString() },
      ConditionExpression: 'attribute_not_exists(pk)',
    }));
  } catch (e) {
    if ((e as { name?: string }).name === 'ConditionalCheckFailedException') return null;
    throw e;
  }
  const r = await ddb.send(new UpdateCommand({
    TableName: TABLE,
    Key: { pk: 'REQ', sk: padId(id) },
    UpdateExpression: 'ADD votes :one',
    ConditionExpression: 'attribute_exists(pk)',
    ExpressionAttributeValues: { ':one': 1 },
    ReturnValues: 'UPDATED_NEW',
  }));
  return Number(r.Attributes?.votes ?? 0);
}

/** Fixed-window rate limit. Returns true if the caller is allowed. */
export async function allow(key: string, limit: number, windowSec: number): Promise<boolean> {
  const window = Math.floor(Date.now() / 1000 / windowSec);
  const r = await ddb.send(new UpdateCommand({
    TableName: TABLE,
    Key: { pk: `RATE#${hash(key)}`, sk: String(window) },
    UpdateExpression: 'ADD #c :one SET #t = :ttl',
    ExpressionAttributeNames: { '#c': 'c', '#t': 'ttl' },
    ExpressionAttributeValues: { ':one': 1, ':ttl': (window + 2) * windowSec },
    ReturnValues: 'UPDATED_NEW',
  }));
  return Number(r.Attributes?.c ?? 0) <= limit;
}

export interface FactoryState {
  armed: boolean;
  armAt?: string;
  killed?: boolean;
  cap?: number;
  admitted?: number;
  heartbeat?: string;
  health?: string;
  mode?: string;
}

export async function factoryState(): Promise<FactoryState> {
  const r = await ddb.send(new GetCommand({ TableName: TABLE, Key: { pk: 'FACTORY', sk: 'STATE' } }));
  const s = (r.Item ?? {}) as Record<string, unknown>;
  return {
    armed: Boolean(s.armed),
    armAt: s.armAt as string | undefined,
    killed: Boolean(s.killed),
    cap: s.cap as number | undefined,
    admitted: s.admitted as number | undefined,
    heartbeat: s.heartbeat as string | undefined,
    health: s.health as string | undefined,
    mode: s.mode as string | undefined,
  };
}
