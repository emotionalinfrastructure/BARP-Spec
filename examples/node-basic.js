const { EISClient, ConsentState } = require('../dist');

async function main() {
  const client = new EISClient();
  const ctid = client.createCTID({ prefix: 'example' });
  const lifecycle = client.createConsentLifecycle();
  lifecycle.transitionTo(ConsentState.PendingReview);
  lifecycle.transitionTo(ConsentState.Granted);
  client.logAudit({ event: 'consent.granted', subject: ctid });
  console.log(client.getAuditLines());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
