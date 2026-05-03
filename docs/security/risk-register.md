# Risk Register

| ID | Risk | Impact | Likelihood | Mitigation | Status |
| --- | --- | --- | --- | --- | --- |
| R-001 | Cross-tenant data access through IDOR/BOLA | Critical | Medium | tenant-scoped queries, RLS, object-level auth, tests | Open |
| R-002 | Field-level data leak through generic response | High | Medium | DTO allowlist, serializers per role, tests | Open |
| R-003 | Dangerous file upload | High | Medium | validation, scanning, quarantine, private storage | Open |
| R-004 | Compromised API key | High | Medium | hash, prefix, scopes, expiry, revoke, audit | Open |
| R-005 | Role escalation through mass assignment | High | Medium | request allowlist, policy layer, role tests | Open |
| R-006 | Stolen session | High | Low/Medium | HttpOnly Secure SameSite, MFA, revoke | Open |
| R-007 | Login/invite/API brute force | Medium | Medium | Redis rate limiting, audit events | Open |
| R-008 | Secrets in logs | High | Medium | log redaction, tests, secret scanning | Open |
| R-009 | CORS/CSRF misconfiguration | High | Medium | CORS allowlist, CSRF tokens, SameSite | Open |
| R-010 | Support access abuse | High | Low | break-glass approval, time limit, audit | Open |

## Status Values

- `Open`: the risk exists and needs implementation.
- `Mitigated`: the control is implemented and tested.
- `Accepted`: the risk is explicitly accepted for the demo with justification.

