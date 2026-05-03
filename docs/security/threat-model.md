# Threat Model

## Scope

This threat model covers TrustVault Lite as a B2B multi-tenant SaaS for confidential documents.

## Assets

| Asset | Sensitivity | Notes |
| --- | --- | --- |
| Uploaded documents | High | Contracts, reports, compliance evidence |
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
| Support Operator | Internal operator with no default access to tenant data |
| External attacker | No account or compromised account |
| Malicious insider | Legitimate user attempting escalation or cross-tenant access |

## Trust Boundaries

- User browser -> Web app.
- Web app -> API.
- API -> Database.
- API -> Object storage.
- API -> Redis/rate limiter.
- API -> Queue/worker.
- Worker -> Malware scanner.
- API -> Identity provider.
- GitHub Actions -> build/deploy artifacts.

## STRIDE

| Category | Risk | Mitigation |
| --- | --- | --- |
| Spoofing | Stolen session or compromised API key | HttpOnly cookies, MFA, session revoke, API key expiry/revoke |
| Tampering | Unauthorized role/project/document changes | RBAC/ABAC, DTO allowlist, audit log |
| Repudiation | User denies an action | Audit events with actor, IP hash, user agent, result |
| Information Disclosure | Cross-tenant document access | tenant-scoped queries, RLS, object-level auth, negative tests |
| Denial of Service | Large uploads or brute force | file size limits, body limits, rate limiting |
| Elevation of Privilege | Viewer becomes Admin through mass assignment | field allowlists, centralized authorization, tests |

## Priority Scenarios

### BOLA / IDOR

A user changes `documentId` in the URL and attempts to access another tenant's document.

Mitigations:

- verify active membership in tenant;
- verify `document.tenantId`;
- set RLS transaction context;
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
- scan job;
- quarantine until `clean`.

### API Key Misuse

A key with `documents:read` is used for delete.

Mitigations:

- scopes per endpoint;
- key hashing;
- expiry and revoke;
- rate limiting;
- audit event for denial.

### Support Access Abuse

An internal operator attempts to view tenant data without approval.

Mitigations:

- support operator has no default access;
- break-glass access requires approval, reason, and expiry;
- every access is logged as high-risk.

