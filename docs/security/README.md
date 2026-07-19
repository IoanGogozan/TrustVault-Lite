# Security Overview

TrustVault Lite is designed as a secure SaaS demo with visible and testable controls.

## Principles

- Security by design.
- Deny by default.
- Least privilege.
- Tenant isolation everywhere.
- Defense in depth.
- Auditability for sensitive actions.
- Verifiable secure SDLC.

## Documents

- [Threat model](threat-model.md)
- [Architecture](architecture.md)
- [ASVS mapping](asvs-mapping.md)
- [Risk register](risk-register.md)
- [Security test plan](security-test-plan.md)
- [Secure SDLC](secure-sdlc.md)

## Main Controls

- Explicitly gated seeded login for local flows and the controlled synthetic production sandbox.
- Production identity target: OIDC Authorization Code Flow with MFA/passkeys.
- Production identity is documented but not implemented in the demo.
- HttpOnly Secure SameSite cookies.
- Centralized RBAC/ABAC.
- Tenant-scoped in-memory runtime plus PostgreSQL/RLS repositories verified in database-backed tests.
- Synthetic PDF validation and authenticated mock scanning.
- Private in-memory object storage behind an adapter boundary.
- Proxy downloads for clean files.
- Hashed API keys with scopes.
- Rate limiting.
- Audit events.
- Security headers.
- CSRF protection.
- CI security scans; the ZAP baseline is intentionally non-blocking.
