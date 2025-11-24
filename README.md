# Emotional Infrastructure™ SDK

Emotional Infrastructure™ SDK (eis-sdk) provides building blocks for consent lifecycle management, audit logging, tolerance handling, and trust repair workflows.

## Installation

```bash
npm install eis-sdk
```

## Usage

```typescript
import {
  EISClient,
  ConsentState,
} from 'eis-sdk';

const client = new EISClient();
const ctid = client.createCTID({ prefix: 'prod' });
const lifecycle = client.createConsentLifecycle();
lifecycle.transitionTo(ConsentState.Granted);

client.logAudit({ event: 'consent.granted', subject: ctid });
console.log(client.getAuditLines());
```

## Development

```bash
npm install
npm run lint
npm test
npm run build
```

## License

MIT
