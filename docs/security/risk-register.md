# Risk Register

| ID | Risk | Impact | Likelihood | Mitigation | Status |
| --- | --- | --- | --- | --- | --- |
| R-001 | Cross-tenant data access through IDOR/BOLA | Critical | Medium | tenant-scoped queries, RLS, object-level auth, tests | Mitigated |
| R-002 | Field-level data leak through generic response | High | Medium | DTO allowlists and tests for forbidden fields | Mitigated |
| R-003 | Dangerous file upload | High | Medium | validation, mock scanning, quarantine until clean, private storage | Mitigated |
| R-004 | Compromised API key | High | Medium | hash, opaque prefix, scopes, expiry, revoke, audit | Mitigated |
| R-005 | Role escalation through mass assignment | High | Medium | strict runtime validation, policy layer, role tests | Mitigated |
| R-006 | Stolen session | High | Low/Medium | HttpOnly Secure SameSite cookies and session revoke; production OIDC/MFA remains outside demo scope | Accepted |
| R-007 | Login/invite/API brute force | Medium | Medium | rate limiting, Redis-compatible adapter, audit events | Mitigated |
| R-008 | Secrets in logs | High | Medium | log redaction, tests, secret scanning | Mitigated |
| R-009 | CORS/CSRF misconfiguration | High | Medium | CORS allowlist, CSRF tokens, SameSite cookies, negative tests | Mitigated |
| R-010 | Production identity gap | High | Medium | demo login is disabled in production mode; production path is OIDC Authorization Code Flow with MFA/passkeys | Accepted |

## Status Values

- `Open`: the risk exists and needs implementation.
- `Mitigated`: the control is implemented and tested.
- `Accepted`: the risk is explicitly accepted for the demo with justification.
