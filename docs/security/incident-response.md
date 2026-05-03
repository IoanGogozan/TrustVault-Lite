# Incident Response

This document defines simple playbooks for the demo.

## Principles

- Contain first.
- Preserve audit evidence.
- Revoke compromised credentials.
- Communicate scope and timeline.
- Document follow-up controls.

## Compromised Account

1. Revoke the user's active sessions.
2. Force credential reset at the identity provider.
3. Review audit logs for recent actions.
4. Revoke API keys created or used suspiciously.
5. Mark the event as high-risk.
6. Create follow-up work for MFA enforcement if it was missing.

## Compromised API Key

1. Revoke the key.
2. Search audit logs by `key_prefix`.
3. Identify actions performed with the key.
4. Create a new key with minimum scopes.
5. Check whether the key appeared in logs or the repository.
6. Run secret scanning.

## Suspected Document Leak

1. Revoke active share links for the document.
2. Review audit logs for downloads.
3. Review tenant membership and role changes.
4. Check whether the document was accessed through an API key.
5. Mark the document for review.

## Support Access Misuse

1. Revoke active support access.
2. Review reason, approval, and expiry.
3. Search all `support.*` actions.
4. Notify the tenant Owner in the demo flow.
5. Create remediation for policy or approval workflow gaps.

