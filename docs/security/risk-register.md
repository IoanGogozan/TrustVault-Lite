# Risk Register

| ID | Risk | Impact | Likelihood | Mitigation | Status |
| --- | --- | --- | --- | --- | --- |
| R-001 | Cross-tenant data access through IDOR/BOLA | Critical | Medium | tenant-scoped repositories, object-level auth, negative tests, and separately verified RLS path | Mitigated |
| R-002 | Field-level data leak through generic response | High | Medium | DTO allowlists and tests for forbidden fields | Mitigated |
| R-003 | Dangerous file upload | High | Medium | synthetic-only warning, validation, mock scan state, quarantine until clean, private storage | Accepted for controlled sandbox |
| R-004 | Compromised API key | High | Medium | hash, opaque prefix, scopes, expiry, revoke, audit | Mitigated |
| R-005 | Role escalation through mass assignment | High | Medium | strict runtime validation, policy layer, role tests | Mitigated |
| R-006 | Stolen session | High | Low/Medium | HttpOnly Secure SameSite cookies and session revoke; production OIDC/MFA remains outside demo scope | Accepted |
| R-007 | Login/API brute force | Medium | Medium | in-memory rate limiting and audit events; single-instance scope is explicit | Mitigated for single instance |
| R-008 | Secrets in logs | High | Medium | log redaction, tests, secret scanning | Mitigated |
| R-009 | CORS/CSRF misconfiguration | High | Medium | CORS allowlist, CSRF tokens, SameSite cookies, negative tests | Mitigated |
| R-010 | Production identity gap | High | Medium | seeded login requires explicit `DEMO_MODE=true`, accepts only synthetic demo identities, and is unsuitable for a real product; the documented extension path is OIDC Authorization Code Flow with MFA/passkeys | Accepted for controlled sandbox |
| R-011 | Loss of demo activity on restart | Medium | High | prominent synthetic/ephemeral warning; no durability or recovery promise | Accepted for controlled sandbox |
| R-012 | Incorrect client IP attribution behind multiple proxies | Medium | Low | Cloudflare is DNS-only, Caddy is the single HTTP proxy, and Fastify trusts exactly one hop | Mitigated |

## Status Values

- `Open`: the risk exists and needs implementation.
- `Mitigated`: the control is implemented and tested.
- `Accepted`: the risk is explicitly accepted for the demo with justification.
- Qualified statuses such as `Mitigated for single instance` state the boundary in which the mitigation is valid.
