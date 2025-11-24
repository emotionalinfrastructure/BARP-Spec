import { describe, expect, it } from '@jest/globals';

import { generateCTID } from '../src/consent/ctid';

describe('generateCTID', () => {
  it('requires a secret key', () => {
    // @ts-expect-error intentional missing key
    expect(() => generateCTID()).toThrow('secretKey is required');
  });

  it('generates reproducible fields', () => {
    const ctid = generateCTID('secret', [1, 2]);
    expect(ctid.id).toMatch(/^ctid-[a-f0-9]+$/);
    expect(ctid.user_id).toHaveLength(64);
    expect(ctid.tiers).toEqual([1, 2]);
    expect(new Date(ctid.created_at).toString()).not.toBe('Invalid Date');
  });

  it('validates entropy bytes', () => {
    expect(() => generateCTID('secret', [], -1)).toThrow('entropyBytes must be a positive integer');
  });
});
