# Emotional Infrastructure™ SDK (eis-sdk)

The Emotional Infrastructure™ SDK provides production-ready primitives for consent lifecycle management, immutable audit logging, emotional-signal tolerance windows, and trust repair analytics. It is designed for regulated environments where provable consent state, traceability, and remediation need to be enforced by default.

## Installation

```bash
npm install eis-sdk
```

## Quickstart

```typescript
import {
  EISClient,
  ConsentState,
  ToleranceWindow,
} from 'eis-sdk';

const client = new EISClient();
const ctid = client.createCTID({ prefix: 'prod' });

const lifecycle = client.createConsentLifecycle();
lifecycle.transitionTo(ConsentState.PendingReview);
lifecycle.transitionTo(ConsentState.Granted);

client.logAudit({ event: 'consent.granted', subject: ctid });
console.log(client.getAuditLines());

const tolerance = new ToleranceWindow({ size: 3, threshold: 2 });
tolerance.recordSignal('affirm');
tolerance.recordSignal('affirm');
console.log(tolerance.isSatisfied()); // true when threshold met inside window
```

## SDK Surface

- **CTID generation (`consent/ctid.ts`)** — Prefixable, entropy-driven identifiers for tracking consent interactions.
- **10-state consent lifecycle (`consent/stateMachine.ts`)** — Explicit transitions across `requested`, `pending_review`, `granted`, `suspended`, `resumed`, `revoked`, `expired`, `denied`, `audit_hold`, and terminal `deleted` states with recorded history.
- **Tolerance windows (`consent/toleranceWindow.ts`)** — Sliding-window counters to observe emotional signals and enforce minimum counts.
- **Audit logger (`audit/logger.ts`)** — Immutable JSONL entries with defaults for `actor`, `subject`, and ISO timestamps plus optional streaming callback.
- **Trace validator (`audit/traceValidator.ts`)** — Verifies recorded consent state progressions against the lifecycle’s permitted transitions.
- **Trust deltas (`repair/trustDelta.ts`)** — Computes per-metric changes between baseline and current trust measurements with aggregate trend.
- **Unified client (`client.ts`)** — Cohesive interface exposing CTID creation, lifecycle helpers, tolerance windows, audit logging, trace validation, and trust delta computation.

## Compliance & Operational Notes

- Every audit entry is serialized as JSONL to ease ingestion into SIEM/archival systems and to prove immutability through append-only handling.
- Consent lifecycle transitions are validated before persistence to prevent illegal state regressions; invalid transitions throw immediately and are flagged by the trace validator.
- Tolerance windows make emotional-signal thresholds explicit, supporting policy gating and review checkpoints.
- Trust deltas quantify directional change, making regression detection and remediation gating straightforward.

## Development

```bash
npm install
npm run lint   # strict type-check (no emit)
npm test       # jest unit tests
npm run build  # compile TypeScript to dist/
```

## Publishing

1. Ensure CI is green on main.
2. Bump version if needed and push a tagged release (e.g., `v0.1.0`).
3. Publish to npm from a clean working tree:

```bash
npm login
npm publish --access public
```

## License

MIT
