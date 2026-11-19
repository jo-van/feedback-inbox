// Generates the n8n workflows for the factory. Run: node build-workflows.mjs <outdir>
// Top level: "Factory Line". Each station is its own sub-workflow with an input
// contract check, the station call, and an output hand-off. Builder is a small
// factory of its own (plan -> edit -> check -> fix -> ship).
import { writeFileSync, mkdirSync } from 'node:fs';

const out = process.argv[2] || './dist';
mkdirSync(out, { recursive: true });
const API = 'http://127.0.0.1:7070';
let n = 0;
const uid = () => `00000000-0000-4000-8000-${String(++n).padStart(12, '0')}`;

const http = (name, path, pos, extra = {}) => ({
  id: uid(), name, type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: pos,
  parameters: {
    method: 'POST', url: API + path, sendHeaders: true,
    headerParameters: { parameters: [{ name: 'X-FF-Token', value: '={{ $env.FF_TOKEN }}' }] },
    sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json) }}',
    options: { timeout: 1_800_000 },
  },
  ...extra,
});
const code = (name, js, pos, extra = {}) => ({ id: uid(), name, type: 'n8n-nodes-base.code', typeVersion: 2, position: pos, parameters: { jsCode: js }, ...extra });
const iff = (name, expr, pos) => ({
  id: uid(), name, type: 'n8n-nodes-base.if', typeVersion: 2.2, position: pos,
  parameters: {
    conditions: {
      options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
      conditions: [{ id: uid(), leftValue: `={{ ${expr} }}`, rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }],
      combinator: 'and',
    },
    looseTypeValidation: true, options: {},
  },
});
const trigger = (pos) => ({ id: uid(), name: 'Called by the line', type: 'n8n-nodes-base.executeWorkflowTrigger', typeVersion: 1.1, position: pos, parameters: { inputSource: 'passthrough' } });
const sub = (name, wfId, pos) => ({
  id: uid(), name, type: 'n8n-nodes-base.executeWorkflow', typeVersion: 1.2, position: pos, onError: 'continueErrorOutput',
  parameters: { source: 'database', workflowId: { __rl: true, value: wfId, mode: 'id' }, mode: 'once', options: { waitForSubWorkflow: true } },
});
const note = (content, pos, w = 380, h = 160, color = 3) => ({ id: uid(), name: 'Note ' + n, type: 'n8n-nodes-base.stickyNote', typeVersion: 1, position: pos, parameters: { content, width: w, height: h, color } });

const conn = (pairs) => {
  const c = {};
  for (const [from, to, output = 0] of pairs) {
    c[from] ??= { main: [] };
    while (c[from].main.length <= output) c[from].main.push([]);
    c[from].main[output].push({ node: to, type: 'main', index: typeof to === 'object' ? 0 : 0 });
  }
  return c;
};
const conn2 = (pairs) => { // supports [from, to, outputIndex, inputIndex]
  const c = {};
  for (const [from, to, output = 0, input = 0] of pairs) {
    c[from] ??= { main: [] };
    while (c[from].main.length <= output) c[from].main.push([]);
    c[from].main[output].push({ node: to, type: 'main', index: input });
  }
  return c;
};
void conn;

const contractCheck = (station, fields) => code('Check input contract', `// Contract ff.v1 · ${station} input
const need = ${JSON.stringify(fields)};
const item = $input.first().json;
const missing = need.filter((k) => item[k] === undefined || item[k] === null || item[k] === '');
if (missing.length) throw new Error('${station} input contract violated: missing ' + missing.join(', '));
return [{ json: item }];`, [220, 0]);
const handOff = (station, nestAs) => code('Hand off output', `// Contract ff.v1 · ${station} output, merged with the job context
const ctx = $('Called by the line').first().json;
const out = $input.first().json;
return [{ json: ${nestAs ? `{ ...ctx, ${nestAs}: out }` : '{ ...ctx, ...out }'} }];`, [660, 0]);

const workflows = [];
const wf = (id, name, nodes, connections, description) => workflows.push({
  id, name, active: false, isArchived: false, nodes, connections, pinData: {},
  settings: { executionOrder: 'v1', callerPolicy: 'workflowsFromSameOwner', saveManualExecutions: true, saveDataSuccessExecution: 'all', saveDataErrorExecution: 'all' },
  meta: { templateCredsSetupCompleted: true }, tags: [], description,
});

// ---- simple station sub-workflows: trigger -> contract -> station -> hand off
const simple = [
  ['ffStationSpec001', '2 · Spec writer', 'spec', ['id', 'round', 'title', 'doneWhen'], null, 'Admitted request → testable acceptance criteria.'],
  ['ffStationTest001', '4 · Tester', 'test', ['id', 'round', 'branch', 'sha'], null, 'Waits for the preview deploy, then runs browser tests and the privacy guard against it.'],
  ['ffStationRevw001', '5a · Adversarial reviewer (Codex)', 'review', ['id', 'round', 'sha'], 'review', 'A different AI model hunts for problems in the diff.'],
  ['ffStationSecu001', '5b · Security scan', 'security', ['id', 'round', 'sha'], 'security', 'Secret scan, path allowlist and risky-pattern checks.'],
  ['ffStationPrev001', '6 · Preview', 'preview', ['id', 'round', 'previewUrl'], null, 'Shows the private preview copy before release.'],
  ['ffStationRels001', '7 · Releaser', 'release', ['id', 'round', 'sha'], null, 'Ships to production, smoke tests it, rolls back automatically on failure.'],
];
for (const [id, name, station, fields, nestAs, desc] of simple) {
  n = Number(id.replace(/\D/g, '')) * 100 + simple.findIndex((s) => s[0] === id) * 50;
  const nodes = [
    trigger([0, 0]), contractCheck(station, fields),
    http(`Station: ${station}`, `/station/${station}`, [440, 0]), handOff(station, nestAs),
    note(`## ${name}\n${desc}\n\n**Input → output contract:** ff.v1 \`${station}\``, [0, -220]),
  ];
  wf(id, name, nodes, conn2([['Called by the line', 'Check input contract'], ['Check input contract', `Station: ${station}`], [`Station: ${station}`, 'Hand off output']]), desc);
}

// ---- Builder: a factory inside the factory
n = 5000;
{
  const nodes = [
    trigger([0, 0]),
    contractCheck('build', ['id', 'round', 'summary', 'acceptance']),
    http('Read code & plan', '/station/build.plan', [440, 0]),
    code('Plan → edit', `return [{ json: { ...$('Called by the line').first().json, ...$input.first().json } }];`, [660, 0]),
    http('Edit code (Claude Code)', '/station/build.edit', [880, 0]),
    code('Edit → check', `return [{ json: { ...$('Plan → edit').first().json, changed: $input.first().json.changed } }];`, [1100, 0]),
    http('Run lint, unit tests, build', '/station/build.check', [1320, 0]),
    iff('Checks pass?', '$json.pass', [1540, 0]),
    code('Failures → fix', `return [{ json: { ...$('Edit → check').first().json, failures: $input.first().json.failures } }];`, [1760, 180]),
    http('Fix failures (Claude Code)', '/station/build.fix', [1980, 180]),
    code('Fix → re-check', `return [{ json: { ...$('Edit → check').first().json } }];`, [2200, 180]),
    http('Re-run checks', '/station/build.check', [2420, 180]),
    iff('Fixed?', '$json.pass', [2640, 180]),
    code('Ready to ship', `return [{ json: { ...$('Edit → check').first().json } }];`, [1980, -60]),
    http('Commit & push branch', '/station/build.ship', [2860, -60]),
    code('Hand off output', `const ctx = $('Called by the line').first().json;
return [{ json: { ...ctx, ...$input.first().json, built: true } }];`, [3080, -60]),
    code('Hand off failure', `const ctx = $('Called by the line').first().json;
return [{ json: { ...ctx, built: false, failures: $input.first().json.failures } }];`, [2860, 360]),
    note('## 3 · Builder — a factory inside the factory\nSame contract shape at every level: each step takes a job in and hands a job out.\n\nRead code & plan → Edit → Check → (Fix → Re-check) → Ship', [0, -260], 640, 200, 4),
  ];
  wf('ffStationBuild01', '3 · Builder (a factory inside the factory)', nodes, conn2([
    ['Called by the line', 'Check input contract'], ['Check input contract', 'Read code & plan'], ['Read code & plan', 'Plan → edit'],
    ['Plan → edit', 'Edit code (Claude Code)'], ['Edit code (Claude Code)', 'Edit → check'], ['Edit → check', 'Run lint, unit tests, build'],
    ['Run lint, unit tests, build', 'Checks pass?'], ['Checks pass?', 'Ready to ship', 0], ['Checks pass?', 'Failures → fix', 1],
    ['Failures → fix', 'Fix failures (Claude Code)'], ['Fix failures (Claude Code)', 'Fix → re-check'], ['Fix → re-check', 'Re-run checks'],
    ['Re-run checks', 'Fixed?'], ['Fixed?', 'Ready to ship', 0], ['Fixed?', 'Hand off failure', 1],
    ['Ready to ship', 'Commit & push branch'], ['Commit & push branch', 'Hand off output'],
  ]), 'Plan, edit, check, fix and ship one change in a sandbox.');
}

// ---- Top level: the line
n = 9000;
{
  const nodes = [
    { id: uid(), name: 'Every 15 seconds', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2, position: [0, 0], parameters: { rule: { interval: [{ field: 'seconds', secondsInterval: 15 }] } } },
    http('1 · Gatekeeper & intake', '/tick', [220, 0]),
    iff('Work admitted?', '$json.job !== null && $json.job !== undefined', [440, 0]),
    code('Start job', `return [{ json: { ...$input.first().json.job } }];`, [660, -20]),
    sub('2 · Spec writer', 'ffStationSpec001', [880, -20]),
    sub('3 · Builder', 'ffStationBuild01', [1100, -20]),
    iff('Built?', '$json.built === true', [1320, -20]),
    sub('4 · Tester', 'ffStationTest001', [1540, -40]),
    iff('Tests pass?', '$json.pass === true', [1760, -40]),
    sub('5a · Adversarial review (Codex)', 'ffStationRevw001', [1980, 80]),
    sub('5b · Security scan', 'ffStationSecu001', [1980, -160]),
    { id: uid(), name: 'Both checks back', type: 'n8n-nodes-base.merge', typeVersion: 3, position: [2200, -40], parameters: { mode: 'combine', combineBy: 'combineByPosition', options: {} } },
    code('Decide', `const j = $input.first().json;
const approved = j.review?.verdict === 'approve' && j.security?.pass === true;
const feedback = [...(j.review?.findings || []).map((f) => 'Reviewer: ' + f), ...(j.security?.findings || []).map((f) => 'Security: ' + f)];
return [{ json: { ...j, approved, failures: feedback } }];`, [2420, -40]),
    iff('Approved?', '$json.approved === true', [2640, -40]),
    sub('6 · Preview', 'ffStationPrev001', [2860, -60]),
    sub('7 · Release to production', 'ffStationRels001', [3080, -60]),
    iff('Live?', '$json.released === true', [3300, -60]),
    code('🚀 Shipped', `return $input.all();`, [3520, -80]),
    iff('Rolled back?', '$json.rolledBack === true', [3520, 120]),
    code('Repair: send back to Builder', `const j = $input.first().json;
const round = (j.round || 0) + 1;
return [{ json: { id: j.id, round, title: j.title, details: j.details, doneWhen: j.doneWhen, summary: j.summary, acceptance: j.acceptance, files: j.files, outOfScope: j.outOfScope, feedback: (j.failures || []).slice(0, 12) } }];`, [1760, 420]),
    iff('Tries left?', '$json.round <= 2', [1980, 420]),
    code('Park: needs a human', `const id = $('1 · Gatekeeper & intake').first().json.job.id;
const j = $input.first().json || {};
const reason = j.rolledBack ? 'Shipped but failed its production check, so it was rolled back automatically.'
  : (j.round > 2) ? 'Could not get it right in three tries; a human will take a look.'
  : 'The line hit an error on this one; a human will take a look.';
return [{ json: { id, round: Math.min(j.round ?? 0, 9), reason } }];`, [2200, 620]),
    http('Park', '/station/park', [2420, 620]),
    note('# Feedback Factory\nRequests from the Feedback Inbox app move left to right. No human touches them.\n\n1 Gatekeeper → 2 Spec → 3 Builder → 4 Tester → 5a Review (Codex) + 5b Security → 6 Preview → 7 Release\n\nFailures loop back to the Builder (max 3 tries) or go to **Needs a human**.', [0, -360], 900, 240, 6),
  ];
  const errorsToPark = ['2 · Spec writer', '3 · Builder', '4 · Tester', '5a · Adversarial review (Codex)', '5b · Security scan', '6 · Preview', '7 · Release to production'];
  wf('ffFactoryLine001', 'Factory Line', nodes, conn2([
    ['Every 15 seconds', '1 · Gatekeeper & intake'], ['1 · Gatekeeper & intake', 'Work admitted?'], ['Work admitted?', 'Start job', 0],
    ['Start job', '2 · Spec writer'], ['2 · Spec writer', '3 · Builder'], ['3 · Builder', 'Built?'],
    ['Built?', '4 · Tester', 0], ['Built?', 'Repair: send back to Builder', 1],
    ['4 · Tester', 'Tests pass?'], ['Tests pass?', '5a · Adversarial review (Codex)', 0], ['Tests pass?', '5b · Security scan', 0], ['Tests pass?', 'Repair: send back to Builder', 1],
    ['5a · Adversarial review (Codex)', 'Both checks back', 0, 0], ['5b · Security scan', 'Both checks back', 0, 1],
    ['Both checks back', 'Decide'], ['Decide', 'Approved?'], ['Approved?', '6 · Preview', 0], ['Approved?', 'Repair: send back to Builder', 1],
    ['6 · Preview', '7 · Release to production'], ['7 · Release to production', 'Live?'], ['Live?', '🚀 Shipped', 0], ['Live?', 'Rolled back?', 1],
    ['Rolled back?', 'Park: needs a human', 0], ['Rolled back?', 'Repair: send back to Builder', 1],
    ['Repair: send back to Builder', 'Tries left?'], ['Tries left?', '3 · Builder', 0], ['Tries left?', 'Park: needs a human', 1],
    ['Park: needs a human', 'Park'],
    ...errorsToPark.map((s) => [s, 'Park: needs a human', 1]),
  ]), 'The whole line: intake to production with no human in the loop.');
}

for (const w of workflows) writeFileSync(`${out}/${w.id}.json`, JSON.stringify(w, null, 2));
console.log('wrote', workflows.length, 'workflows to', out);
