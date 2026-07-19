# Threat Model

## Scope

This threat model covers the live controlled sandbox and the security controls demonstrated by TrustVault Lite. It does not treat the sandbox as a durable production SaaS or permit real confidential data.

## Assets

| Asset | Sensitivity | Notes |
| --- | --- | --- |
| Synthetic uploaded documents | Demo-only | Real contracts, reports, personal data, or compliance evidence are prohibited |
| Document metadata | Medium/High | Titles, classifications, owner, project |
| Tenant data | High | Members, roles, settings |
| Audit logs | High | May contain security events and metadata |
| API keys | Critical | Only hashes are stored, full key is shown once |
| Sessions | Critical | HttpOnly Secure SameSite cookies |
| Share links | High | Hashed token, expiry, max downloads |

## Actors

| Actor | Description |
| --- | --- |
| Legitimate user | Member of a tenant |
| Owner/Admin | User with administrative rights |
| Viewer/Auditor | User with limited rights |
| API client | External system using an API key |
| External attacker | No account or compromised account |
| Malicious insider | Legitimate user attempting escalation or cross-tenant access |

## Trust Boundaries

- User browser -> Cloudflare -> shared Caddy edge.
- Caddy -> web/API containers on the external Docker proxy network.
- API -> in-memory domain state, private objects, sessions, rate limiter, and audit events.
- Migration/tests -> PostgreSQL on the internal Docker data network.
- API -> In-process scan queue/worker.
- GitHub-hosted Actions -> CI/security results. The home-server deployment workflow is inactive without a dedicated trusted runner.

## STRIDE

| Category | Risk | Mitigation |
| --- | --- | --- |
| Spoofing | Stolen session or compromised API key | HttpOnly cookies, session revoke, API key expiry/revoke; production identity should add MFA/passkeys |
| Tampering | Unauthorized role/project/document changes | RBAC/ABAC, DTO allowlist, audit log |
| Repudiation | User denies an action | In-memory audit events with actor, IP hash, user agent, and result; no durability claim |
| Information Disclosure | Cross-tenant document access | tenant-scoped repositories, object-level auth, negative tests, separately verified RLS path |
| Denial of Service | Large uploads or brute force | file size limits, body limits, rate limiting |
| Elevation of Privilege | Viewer becomes Admin through mass assignment | field allowlists, centralized authorization, tests |

## Priority Scenarios

### BOLA / IDOR

A user changes `documentId` in the URL and attempts to access another tenant's document.

Mitigations:

- verify active membership in tenant;
- verify `document.tenantId`;
- use tenant-scoped repository operations; database-backed tests additionally set RLS transaction context;
- return `403` or `404` without leaking metadata;
- log `document.cross_tenant_denied`.

### BOPLA / Field Leak

An endpoint returns a full object and exposes `storage_key`, `token_hash`, or internal metadata.

Mitigations:

- response DTO allowlist;
- serializers per role;
- tests for forbidden fields.

### Malicious File Upload

An attacker uploads a file with an allowed extension but dangerous content.

Mitigations:

- extension allowlist;
- MIME sniffing;
- magic bytes;
- max file size;
- private storage;
- in-process scan job;
- quarantine until `clean`.

The mock scanner demonstrates state transitions and authorization boundaries only; it is not a malware-detection control suitable for real files.

### API Key Misuse

A key with `documents:read` is used for delete.

Mitigations:

- scopes per endpoint;
- key hashing;
- expiry and revoke;
- rate limiting;
- audit event for denial.

## Explicit Demo Scope Limits

- Production OIDC and MFA/passkeys are documented as the target identity posture, not implemented in the demo.
- The scan worker uses documented mock scanning instead of ClamAV.
- Live business state and audit evidence are in memory and reset on API restart.
- Cloudflare is an additional proxy hop. End-user IP attribution remains an open operational risk until Caddy trusts only Cloudflare ranges and direct-origin access is restricted, or the record is changed to DNS-only.
- PostgreSQL/RLS repositories are implemented and tested but are not selected by the live `server.ts` bootstrap.
