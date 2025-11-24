export interface CTIDOptions {
  /** Prefix added to the generated CTID, separated by a hyphen. */
  prefix?: string;
  /** Number of random bytes used for entropy. Defaults to 16 (32 hex chars). */
  entropyBytes?: number;
}

/** Unique Consent Transaction Identifier (CTID). */
export type CTID = string;

function randomHex(bytes: number): string {
  const buffer: number[] = [];
  for (let i = 0; i < bytes; i += 1) {
    buffer.push(Math.floor(Math.random() * 256));
  }
  return buffer.map((value) => value.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a CTID using pseudo-random bytes. A prefix can be supplied to
 * namespace identifiers for different environments or tenants.
 */
export function generateCTID(options: CTIDOptions = {}): CTID {
  const { prefix, entropyBytes = 16 } = options;
  if (entropyBytes <= 0 || !Number.isInteger(entropyBytes)) {
    throw new Error('entropyBytes must be a positive integer');
  }
  const base = randomHex(entropyBytes);
  return (prefix ? `${prefix}-${base}` : base) as CTID;
}
