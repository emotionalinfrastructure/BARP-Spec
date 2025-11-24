# FAQ

**Why ten consent states?**
To represent operational flows such as audit holds, suspensions, and resumptions without losing forward-only provenance.

**How should audit logs be stored?**
Append JSONL lines to immutable storage (object store with versioning or WORM media) and hash batches for integrity proofs.

**Can I extend CTID entropy?**
Yes. Pass `entropyBytes` to `generateCTID` or apply a prefix to namespace per-tenant identifiers.
