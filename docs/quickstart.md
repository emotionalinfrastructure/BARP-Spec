# Quickstart

1. Install the SDK:

```bash
npm install eis-sdk
```

2. Initialize the client and generate a CTID:

```typescript
import { EISClient, ConsentState } from 'eis-sdk';

const client = new EISClient();
const ctid = client.createCTID({ prefix: 'prod' });
```

3. Move through the consent lifecycle with validated transitions:

```typescript
const lifecycle = client.createConsentLifecycle();
lifecycle.transitionTo(ConsentState.PendingReview);
lifecycle.transitionTo(ConsentState.Granted);
```

4. Capture audit events:

```typescript
client.logAudit({ event: 'consent.granted', subject: ctid });
console.log(client.getAuditLines());
```

5. Validate consent traces before persisting:

```typescript
const traceResult = client.validateTrace([
  ConsentState.Requested,
  ConsentState.PendingReview,
  ConsentState.Granted,
]);
```

6. Evaluate timing windows for emotional signals:

```typescript
import { ToleranceWindow } from 'eis-sdk';

const window = new ToleranceWindow({
  start: new Date('2024-01-01T00:00:00Z'),
  durationMs: 5 * 60 * 1000,
  toleranceMs: 250,
});

window.isWithin(new Date());
```

7. Compute trust deltas for remediation gates:

```typescript
import { computeTrustDelta } from 'eis-sdk';

const delta = computeTrustDelta({ adherence: 0.8 }, { adherence: 0.92 });
```
