// Versioned input/output contracts for every station. Every boundary is validated:
// n8n calls a station with an input, the station validates it, does its work, and
// validates its own output before returning it. Same shape at every level
// ("factories all the way down").

export const CONTRACT_VERSION = 'ff.v1';

const T = {
  str: (v) => typeof v === 'string',
  nestr: (v) => typeof v === 'string' && v.length > 0,
  int: (v) => Number.isInteger(v),
  bool: (v) => typeof v === 'boolean',
  arr: (v) => Array.isArray(v),
  obj: (v) => v !== null && typeof v === 'object' && !Array.isArray(v),
  oneOf: (...xs) => (v) => xs.includes(v),
  opt: (f) => (v) => v === undefined || v === null || f(v),
};

const job = { id: T.int, round: T.int };

export const CONTRACTS = {
  'gate': {
    in: { id: T.int, title: T.nestr, details: T.str, doneWhen: T.nestr },
    out: { decision: T.oneOf('admit', 'reject'), reason: T.nestr, hide: T.bool, category: T.nestr },
  },
  'spec': {
    in: { ...job, title: T.nestr, details: T.str, doneWhen: T.nestr },
    out: { ...job, summary: T.nestr, acceptance: T.arr, files: T.arr, outOfScope: T.arr },
  },
  'build.plan': {
    in: { ...job, summary: T.nestr, acceptance: T.arr, feedback: T.opt(T.arr) },
    out: { ...job, plan: T.arr },
  },
  'build.edit': { in: { ...job, plan: T.arr }, out: { ...job, changed: T.arr } },
  'build.check': { in: { ...job }, out: { ...job, pass: T.bool, failures: T.arr } },
  'build.fix': { in: { ...job, failures: T.arr }, out: { ...job, changed: T.arr } },
  'build.ship': { in: { ...job }, out: { ...job, branch: T.nestr, sha: T.nestr, changed: T.arr } },
  'test': {
    in: { ...job, branch: T.nestr, sha: T.nestr },
    out: { ...job, pass: T.bool, previewUrl: T.nestr, failures: T.arr, passed: T.int, failed: T.int },
  },
  'review': {
    in: { ...job, sha: T.nestr },
    out: { ...job, verdict: T.oneOf('approve', 'changes'), findings: T.arr, model: T.nestr },
  },
  'security': { in: { ...job, sha: T.nestr }, out: { ...job, pass: T.bool, findings: T.arr } },
  'preview': { in: { ...job, previewUrl: T.nestr }, out: { ...job, previewUrl: T.nestr } },
  'release': {
    in: { ...job, sha: T.nestr },
    out: { ...job, released: T.bool, productionSha: T.str, rolledBack: T.bool, failures: T.arr },
  },
  'park': { in: { ...job, reason: T.nestr }, out: { ...job, stage: T.nestr } },
};

export class ContractError extends Error {}

export function check(station, dir, value) {
  const c = CONTRACTS[station]?.[dir];
  if (!c) throw new ContractError(`unknown contract ${station}.${dir}`);
  if (!T.obj(value)) throw new ContractError(`${station}.${dir}: expected an object`);
  const bad = Object.entries(c).filter(([k, f]) => !f(value[k])).map(([k]) => k);
  if (bad.length) throw new ContractError(`${station}.${dir} contract ${CONTRACT_VERSION} violated: ${bad.join(', ')}`);
  return value;
}
