import { createHash, randomBytes } from 'node:crypto';

import { ConsentError } from '../utils/errors';

export interface ConsentTransactionID {
  /** Unique identifier for the consent transaction */
  id: string;
  /** Stable user hash derived from the provided secret */
  user_id: string;
  /** Requested consent tiers */
  tiers: number[];
  /** ISO timestamp for when the CTID was created */
  created_at: string;
}

function hashSecret(secret: string): string {
  return createHash('sha256').update(secret).digest('hex');
}

function randomHex(bytes: number): string {
  return randomBytes(bytes).toString('hex');
}

/**
 * Generate a cryptographically strong Consent Transaction ID (CTID).
 *
 * @param secretKey Secret key used to derive a stable user hash.
 * @param tiers Consent tiers requested for the interaction.
 * @param entropyBytes Number of random bytes used for entropy (default: 16).
 */
export function generateCTID(
  secretKey: string,
  tiers: number[] = [],
  entropyBytes = 16,
): ConsentTransactionID {
  if (!secretKey) {
    throw new ConsentError('secretKey is required to generate a CTID');
  }
  if (entropyBytes <= 0 || !Number.isInteger(entropyBytes)) {
    throw new ConsentError('entropyBytes must be a positive integer');
  }

  const created_at = new Date().toISOString();
  const nonce = randomHex(entropyBytes);
  const user_id = hashSecret(secretKey);
  const id = `ctid-${nonce}`;

  return { id, user_id, tiers, created_at };
}
