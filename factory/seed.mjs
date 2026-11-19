// Reset and seed a table. usage: node seed.mjs <table> [--reset] [--state live|rehearsal] [--arm-at ISO] [--cap N] [--allow-seeded]
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BatchWriteCommand, DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const [table, ...flags] = process.argv.slice(2);
const opt = (k) => { const i = flags.indexOf(k); return i >= 0 ? flags[i + 1] : undefined; };
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }), { marshallOptions: { removeUndefinedValues: true } });
if (!table?.startsWith('feedback-factory-') || table.endsWith('-contacts')) throw new Error('refusing table ' + table);

if (flags.includes('--reset')) {
  let k, n = 0;
  do {
    const r = await ddb.send(new ScanCommand({ TableName: table, ExclusiveStartKey: k, ProjectionExpression: 'pk, sk' }));
    for (let i = 0; i < (r.Items || []).length; i += 25) {
      await ddb.send(new BatchWriteCommand({ RequestItems: { [table]: r.Items.slice(i, i + 25).map((Key) => ({ DeleteRequest: { Key } })) } }));
      n += r.Items.slice(i, i + 25).length;
    }
    k = r.LastEvaluatedKey;
  } while (k);
  console.log('deleted', n, 'items');
}

const seeds = [
  ['Show how many requests are in each status', 'At the top I can see counts like "Shipped: 2" and "Building: 1".'],
  ['Let me filter the list by status', 'Tapping "Shipped" shows only shipped requests; tapping "All" shows everything again.'],
  ['Make it obvious which requests just shipped', 'Requests shipped in the last hour have a visible "New!" badge.'],
  ['Add a short "How this works" explainer', 'A small section on the home page explains the factory in three steps.'],
  ['Show when each request was submitted', 'Each request shows something like "5 minutes ago".'],
];
const base = Date.now() - 3600_000;
let id = 0;
for (const [title, doneWhen] of seeds) {
  id++;
  const at = new Date(base + id * 60_000).toISOString();
  await ddb.send(new PutCommand({ TableName: table, Item: {
    pk: 'REQ', sk: 'REQ#' + String(id).padStart(6, '0'), id, title, details: '', doneWhen, name: 'Jonathan', votes: 1,
    stage: 'received', round: 0, seeded: true, screened: true, eligible: true, source: 'seed', createdAt: at, updatedAt: at, history: [{ stage: 'received', at }],
  } }));
}
await ddb.send(new PutCommand({ TableName: table, Item: { pk: 'META', sk: 'COUNTER', n: id } }));
const state = opt('--state');
if (state) {
  await ddb.send(new PutCommand({ TableName: table, Item: {
    pk: 'FACTORY', sk: 'STATE', mode: state, armed: state === 'rehearsal', armAt: opt('--arm-at'), cap: Number(opt('--cap') || 3), admitted: 0,
    killed: false, allowSeeded: flags.includes('--allow-seeded'), heartbeat: new Date().toISOString(), health: 'ok',
  } }));
}
console.log('seeded', id, 'requests into', table, state ? `state=${state}` : '');
