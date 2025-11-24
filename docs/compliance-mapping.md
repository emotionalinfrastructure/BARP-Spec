# Compliance Mapping

- **Auditability**: JSONL audit logs are append-only and timestamped in ISO 8601, supporting evidentiary capture for SOC 2 and ISO 27001 controls.
- **Consent Integrity**: The 10-state lifecycle enforces forward-only transitions, aligning with GDPR record-keeping expectations for consent updates.
- **Traceability**: `validateConsentTrace` provides deterministic validation suitable for pre-commit hooks or CI checks before persisting consent traces.
- **Resilience**: `ToleranceWindow` and `computeTrustDelta` supply guardrails for drift detection and remediation workflows.
