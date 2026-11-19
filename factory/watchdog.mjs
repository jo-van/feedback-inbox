// Runs every minute (systemd timer). Keeps the line alive and honest:
// restarts dead services, enforces the kill switch, parks stuck jobs.
import { execFileSync } from 'node:child_process';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const table = process.env.FF_TABLE || 'feedback-factory-prod';
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));
const sh = (cmd, args) => { try { return execFileSync(cmd, args, { encoding: 'utf8', timeout: 60_000 }); } catch (e) { return null; } };
const up = async (url) => { try { return (await fetch(url, { signal: AbortSignal.timeout(5000) })).ok; } catch { return false; } };
const notes = [];

if (!(await up('http://127.0.0.1:7070/health'))) { sh('systemctl', ['restart', 'ff-station']); notes.push('restarted station service'); }
if (!(await up('http://127.0.0.1:5678/healthz'))) { sh('docker', ['restart', 'n8n']); notes.push('restarted n8n'); }
if (!(sh('docker', ['inspect', '-f', '{{.State.Running}}', 'ff-proxy']) || '').includes('true')) { sh('docker', ['start', 'ff-proxy']); notes.push('restarted proxy'); }

const f = (await ddb.send(new GetCommand({ TableName: table, Key: { pk: 'FACTORY', sk: 'STATE' } }))).Item || {};
if (f.killed) {
  const ids = (sh('docker', ['ps', '-q', '--filter', 'label=ff-job']) || '').split('\n').filter(Boolean);
  if (ids.length) { sh('docker', ['kill', ...ids]); notes.push(`kill switch: stopped ${ids.length} containers`); }
}

const items = (await ddb.send(new QueryCommand({ TableName: table, KeyConditionExpression: 'pk = :p', ExpressionAttributeValues: { ':p': 'REQ' } }))).Items || [];
const active = ['spec', 'build', 'test', 'checks', 'review', 'security', 'preview'];
for (const r of items) {
  if (!active.includes(r.stage)) continue;
  const age = (Date.now() - Date.parse(r.updatedAt || r.createdAt)) / 60000;
  const limit = Number(process.env.FF_STUCK_MIN || 25);
  if (age > limit || f.killed) {
    const now = new Date().toISOString();
    await ddb.send(new UpdateCommand({ TableName: table, Key: { pk: 'REQ', sk: r.sk },
      UpdateExpression: 'SET stage = :s, publicReason = :why, updatedAt = :t, history = list_append(if_not_exists(history, :e), :h) REMOVE checks',
      ExpressionAttributeValues: { ':s': 'needs_human', ':why': f.killed ? 'Stopped by the kill switch.' : `Stuck for ${Math.round(age)} minutes; a human will look.`, ':t': now, ':e': [], ':h': [{ stage: 'needs_human', at: now }] } }));
    notes.push(`parked #${r.id}`);
  }
}

const recent = sh('journalctl', ['-u', 'ff-station', '--since', '-2min', '--no-pager', '-o', 'cat']) || '';
const limited = /usage limit|rate limit|429|overloaded/i.test(recent);
const health = limited ? 'usage-limit' : notes.some((n) => n.startsWith('restarted')) ? 'recovering' : 'ok';
await ddb.send(new UpdateCommand({ TableName: table, Key: { pk: 'FACTORY', sk: 'STATE' },
  UpdateExpression: 'SET watchdogAt = :t, watchdogHealth = :h, watchdogNotes = :n',
  ExpressionAttributeValues: { ':t': new Date().toISOString(), ':h': health, ':n': notes } }));
if (notes.length) console.log(notes.join('; '));
