import React, { useMemo, useState } from 'react';
import { EISClient, ConsentState } from '../../dist';

const client = new EISClient();

export function EISCompleteDemo() {
  const [ctid] = useState(() => client.createCTID({ prefix: 'ui' }));
  const lifecycle = useMemo(() => client.createConsentLifecycle(), []);
  const [logs, setLogs] = useState<string[]>([]);

  const grant = () => {
    lifecycle.transitionTo(ConsentState.PendingReview);
    lifecycle.transitionTo(ConsentState.Granted);
    client.logAudit({ event: 'consent.granted', subject: ctid });
    setLogs(client.getAuditLines());
  };

  return (
    <div>
      <h1>Emotional Infrastructure™ SDK Demo</h1>
      <p>CTID: {ctid}</p>
      <p>State: {lifecycle.state}</p>
      <button onClick={grant}>Grant Consent</button>
      <pre>{logs.join('\n')}</pre>
    </div>
  );
}
