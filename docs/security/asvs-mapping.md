# ASVS Mapping

This mapping is ASVS-inspired and does not represent certification.

| Area | TrustVault Lite Control | Evidence |
| --- | --- | --- |
| Architecture | Threat model and architecture docs | `docs/security/threat-model.md`, `docs/security/architecture.md` |
| Authentication | `DEMO_MODE`-gated seeded sandbox login; OIDC Authorization Code Flow documented as a real-product path | Auth flow tests and demo-account documentation |
| MFA | Not implemented; documented as production identity requirement | README limitations and risk register |
| Session Management | HttpOnly Secure SameSite cookies, revocation | Header/session tests |
| Access Control | Centralized RBAC/ABAC, deny-by-default | `packages/authz`, role tests |
| Multi-tenancy | tenant-scoped runtime repositories plus implemented PostgreSQL RLS path | policy tests, migration policies, database-backed cross-tenant tests |
| Input Validation | DTO/schema validation | API tests |
| File Upload | extension allowlist, MIME/magic-byte checks, size limit, mock scan state | upload and scan tests |
| API Security | scopes, hashed API keys, rate limits | API integration tests |
| Audit Logging | structured audit events | audit event assertions |
| Data Protection | private in-memory storage abstraction and proxy downloads for clean files | download tests |
| Error Handling | no stack traces in production | error response tests |
| Configuration | config validation at startup | config package tests |
| Dependency Security | blocking `pnpm audit` at moderate severity in the security workflow | GitHub Actions result |
| Secret Handling | Gitleaks scan in the security workflow | GitHub Actions result |

## Notes

- RLS is a tested defense-in-depth path, not the live sandbox runtime adapter. Authorization checks remain mandatory in code.
- Endpoints do not return raw database models; they use DTO allowlists.
- Every sensitive access denial should produce an audit event.
