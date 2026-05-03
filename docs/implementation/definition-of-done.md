# Definition of Done

The application is portfolio-ready when the answers below are demonstrable in the app, tests, and documentation.

| Question | Demonstrable Answer |
| --- | --- |
| How are tenants isolated? | `tenant_id`, RLS, cross-tenant tests |
| How is IDOR/BOLA prevented? | Object-level authorization plus negative tests |
| How are roles controlled? | Centralized RBAC/ABAC |
| How are files protected? | Private storage, validation, scanning, signed URLs |
| How are sessions managed? | Secure cookies, revocation, active sessions |
| How are suspicious events detected? | Audit logs plus security dashboard |
| How is the API secured? | Scoped API keys, rate limits, no mass assignment |
| How is secure SDLC demonstrated? | Docs, threat model, CI security scans |
| How is it verifiable? | Automated tests plus security report |

## Avoid

- JWT in localStorage.
- Role checks only in the frontend.
- Endpoints without tenant checks.
- `findById(id)` without tenant context.
- Public direct uploads to object storage.
- API responses that return full objects without an allowlist.
- Tokens or API keys in logs.
- Passwords or reset tokens in plaintext.
- Wildcard CORS.
- Missing negative tests.
- README claims like "secure app" without evidence.

