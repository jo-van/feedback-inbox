import { describe, expect, it } from 'vitest';
import { clean, padId, statusLabel, validateNewRequest } from '../../lib/model';

describe('statusLabel', () => {
  it('maps factory stages to plain-English labels', () => {
    expect(statusLabel('received')).toBe('Received');
    expect(statusLabel('build')).toBe('Building');
    expect(statusLabel('review')).toBe('In review');
    expect(statusLabel('released')).toBe('Shipped');
    expect(statusLabel('rejected')).toBe('Not today');
  });
});

describe('clean', () => {
  it('strips control characters and trims to length', () => {
    expect(clean('  hi\u0000 there  ', 100)).toBe('hi there');
    expect(clean('abcdef', 3)).toBe('abc');
    expect(clean(42, 10)).toBe('');
  });
});

describe('validateNewRequest', () => {
  const base = { title: 'Sort by votes', doneWhen: 'Top voted is first', name: 'Ana' };
  it('accepts a minimal valid request', () => {
    expect(validateNewRequest(base).ok).toBe(true);
  });
  it('requires a done-when line', () => {
    expect(validateNewRequest({ ...base, doneWhen: '' }).ok).toBe(false);
  });
  it('requires consent when an email is given', () => {
    expect(validateNewRequest({ ...base, email: 'a@b.co' }).ok).toBe(false);
    expect(validateNewRequest({ ...base, email: 'a@b.co', consent: true }).ok).toBe(true);
  });
});

describe('padId', () => {
  it('zero pads ids so they sort', () => {
    expect(padId(12)).toBe('REQ#000012');
  });
});
