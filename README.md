# Emotional Infrastructure™ SDK (EIS-SDK)

**Emotional Infrastructure™ SDK (EIS-SDK)** is a production-ready reference implementation of the **EIS v1.1** standard for ethical, emotionally-aware AI systems.

It operationalizes:

- Cryptographic **consent proofs** (CTID)
- **10-state consent lifecycle** management
- **Real-time emotional tolerance windows**
- **Immutable JSONL audit trails**
- **Trust repair metrics** and compliance reporting

> “The most powerful infrastructure is invisible until it’s needed.”

---

## ✨ Features

### Consent Management

- Cryptographically strong **Consent Transaction IDs (CTID)**
- Full **10-state consent lifecycle** with explicit transition validation
- Support for renewal chains via parent/child CTIDs
- Hooks for emergency revocation and downstream shutdown flows

### Emotional Monitoring

- Real-time **emotional signal windowing** via tolerance windows
- Baseline calibration over configurable windows
- Deviation detection using configurable tolerances
- Revalidation triggers when emotional context drifts

### Audit & Compliance

- **Immutable JSONL** audit log writer
- **TraceValidator** engine for temporal ordering and lifecycle conformance
- Signal Trace Completeness (STC) scoring hooks
- Human-readable validation reports for compliance mapping

### Trust Repair

- **Trust Delta** calculator based on survey snapshots
- Repair latency, closure rate, and compliance checks
- Textual compliance reports for regulators, auditors, and internal review

---

## 📦 Installation

```bash
npm install eis-sdk
# or
yarn add eis-sdk
# or
pnpm add eis-sdk
```

---

## 🚀 Quickstart

```typescript
import {
  EISClient,
  ConsentState,
  ToleranceWindow,
  VALID_TRANSITIONS,
} from 'eis-sdk';

const client = new EISClient();
const ctid = client.createCTID({ prefix: 'prod' });

const lifecycle = client.createConsentLifecycle();
lifecycle.transitionTo(ConsentState.PendingReview);
lifecycle.transitionTo(ConsentState.Granted);

client.logAudit({ event: 'consent.granted', subject: ctid });
console.log(client.getAuditLines()); // JSONL strings

const tolerance = new ToleranceWindow({
  start: new Date(),
  durationMs: 60_000,
  toleranceMs: 500,
});

console.log(tolerance.isWithin(new Date())); // true when within the window
console.log(VALID_TRANSITIONS[lifecycle.state]);
```

Trust delta calculation:

```typescript
import { computeTrustDelta } from 'eis-sdk';

const baseline = { reliability: 0.9, transparency: 0.85 };
const current = { reliability: 0.8, transparency: 0.88 };

const delta = computeTrustDelta(baseline, current);
console.log(delta);
```

---

## 🛡️ Compliance & Operational Notes

- Every audit entry is serialized as JSONL to ease SIEM ingestion and prove immutability through append-only handling.
- Consent lifecycle transitions are validated before persistence to prevent illegal state regressions; invalid transitions throw immediately and are flagged by the trace validator.
- Tolerance windows make emotional-signal timing explicit, supporting policy gating and review checkpoints.
- Trust deltas quantify directional change, making regression detection and remediation gating straightforward.

---

## 🧪 Development

```bash
npm install
npm run lint       # eslint over TypeScript sources
npm run test       # jest unit tests with coverage
npm run build      # compile TypeScript to dist/
```

---

## 📦 Publishing

1. Ensure CI is green on main.
2. Bump version if needed and push a tagged release (e.g., `v0.1.0`).
3. Publish to npm from a clean working tree:

```bash
npm login
npm publish --access public
```

---

## 📄 License

Apache-2.0
