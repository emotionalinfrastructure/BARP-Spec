import { generateCTID } from '../src/consent/ctid';

describe('generateCTID', () => {
  it('generates unique identifiers with default entropy', () => {
    const id1 = generateCTID();
    const id2 = generateCTID();
    expect(id1).not.toEqual(id2);
    expect(id1).toHaveLength(32);
  });

  it('supports prefixes', () => {
    const id = generateCTID({ prefix: 'prod', entropyBytes: 4 });
    expect(id.startsWith('prod-')).toBe(true);
    expect(id.split('-')[1]).toHaveLength(8);
  });

  it('validates entropy', () => {
    expect(() => generateCTID({ entropyBytes: 0 })).toThrow('entropyBytes must be a positive integer');
  });
});
