# TrustVault Lite

TrustVault Lite is a B2B multi-tenant SaaS portfolio demo built as a secure client evidence portal for confidential documents, compliance evidence, contracts, and reports.

The goal is to demonstrate real security controls in a small product. This project does not claim certification or formal compliance.

## Positioning

**ASVS-inspired secure SaaS demo, focused on tenant isolation, authorization, secure file handling, auditability, and secure SDLC.**

TrustVault Lite is inspired by:

- OWASP ASVS for secure verification requirements.
- OWASP API Security Top 10 for risks such as BOLA and BOPLA.
- OWASP File Upload Cheat Sheet for secure upload handling.
- NIST Digital Identity Guidelines for digital identity principles.
- OWASP SAMM for a simplified secure SDLC.

## Implemented Capabilities

- Multi-tenant organizations with `tenant_id` on business data.
- Centralized RBAC and ABAC policy layer.
- PostgreSQL Row Level Security as defense in depth.
- Secure file uploads with validation, scanning, and private storage.
- Proxy downloads for clean files without exposing storage keys.
- Hashed API keys with scopes, expiry, and revocation.
- Audit logs and security dashboard.
- Development-only demo login, secure cookies, CSRF protection, and session revocation.
- CI/CD with linting, tests, dependency scanning, secret scanning, SAST, container scanning, and ZAP baseline.

## Documentation

- [Product brief](docs/product/product-brief.md)
- [Demo script](docs/product/demo-script.md)
- [Demo accounts](docs/product/demo-accounts.md)
- [Portfolio assets](docs/product/portfolio-assets.md)
- [Implemented controls](docs/implementation/implemented-controls.md)
- [Definition of done](docs/implementation/definition-of-done.md)
- [Security overview](docs/security/README.md)
- [Threat model](docs/security/threat-model.md)
- [Architecture](docs/security/architecture.md)
- [ASVS mapping](docs/security/asvs-mapping.md)
- [Risk register](docs/security/risk-register.md)
- [Security test plan](docs/security/security-test-plan.md)
- [Incident response](docs/security/incident-response.md)
- [Secure SDLC](docs/security/secure-sdlc.md)

## Architecture Diagram

This diagram includes implemented local components plus production extension points such as OIDC, Redis, and scanner services. The implemented scope is listed below.

![TrustVault Lite security architecture](docs/assets/trustvault-security-architecture.svg)

## Repository Structure

```text
trustvault-lite/
  apps/
    web/
    api/
  packages/
    audit/
    authz/
    config/
    database/
    storage/
    validation/
  infra/
    docker/
    migrations/
  docs/
    product/
    implementation/
    security/
  .github/
    workflows/
```

## Implemented Demo Scope

- Development login with seeded users and tenant memberships.
- Tenant switcher with membership enforcement.
- Centralized authorization policy layer with role-boundary tests.
- PostgreSQL RLS migration and database-backed cross-tenant tests.
- Project and document lifecycle with mock scan processing.
- Private storage abstraction, expiring download metadata, and proxy download endpoints.
- Share links with opaque hashed tokens, public-safe responses, expiry, revocation, and max-download controls.
- API keys with hashed storage, one-time display, scopes, expiry, revocation, and external API usage.
- Audit events and security dashboard for security-relevant activity, including auth, invitation, role-change, API key, share-link, and document lifecycle events.
- Browser/API hardening with CSP, security headers, CORS, CSRF, rate limits, shape validation, and log redaction.
- GitHub Actions CI and security workflows.

## Local Development

```bash
pnpm install
pnpm db:up
pnpm db:migrate
pnpm dev:api
pnpm dev:web
```

The local PostgreSQL service is defined in `infra/docker/docker-compose.yml`.
The initial RLS migration is in `infra/migrations/0001_initial_rls.sql`.

The demo setup can also be prepared with:

```bash
pnpm demo:setup
```

Then run the API and web app in separate terminals:

```bash
pnpm dev:api
pnpm dev:web
```

Open `http://localhost:3000` and log in with `owner@acme.test`.

Database-backed integration tests are opt-in:

```bash
pnpm db:up
pnpm db:migrate
pnpm test:db
```

## Local Security Checks

```bash
pnpm test:security
```

This runs linting, unit/integration tests, type checks, and database-backed tests.

The ZAP scan expects the web app to be available at `http://localhost:3000` on the host machine.

## Production Deployment

The controlled public sandbox target is `https://vault.norvix.no`, fronted by Caddy on TCP 80/443 and UDP 443. `DEMO_MODE=true` explicitly enables seeded-account login independently of `NODE_ENV=production`; without it, the demo login returns `404`. The deployment checklist is documented in [the production deployment runbook](docs/operations/production-deployment.md).

The public sandbox accepts synthetic data only, runs as a single instance, resets its in-memory state on restart, and disables organization and invitation creation.

## Demo Accounts

| Email | Tenant | Role |
| --- | --- | --- |
| `owner@acme.test` | Acme Corp | Owner |
| `admin@acme.test` | Acme Corp | Admin |
| `member@acme.test` | Acme Corp | Member |
| `viewer@acme.test` | Acme Corp | Viewer |
| `auditor@acme.test` | Acme Corp | Auditor |
| `owner@globex.test` | Globex | Owner |

See [demo accounts](docs/product/demo-accounts.md) for the role-by-role walkthrough.

## Security Controls Matrix

| Area | Control | Implemented Through | Testable Through |
| --- | --- | --- | --- |
| Auth | Demo login + session controls | Development auth flow | Login/session tests |
| Sessions | Secure cookies | BFF/session config | Header tests |
| Authorization | RBAC + ABAC | `can()` policy layer | Role tests |
| Tenant isolation | RLS + `tenant_id` | PostgreSQL policies | Cross-tenant tests |
| API Security | Scoped API keys | Hash + scopes + expiry | API integration tests |
| File Security | Validation + scanning | In-process mock scan worker | Upload tests |
| Data Protection | Private storage | Proxy downloads | Download tests |
| Auditability | Audit events | Audit service | Audit assertions |
| Browser Security | CSP + headers | Middleware | Header tests |
| DevSecOps | Security scans in CI | GitHub Actions | Pipeline artifacts |
| Secrets | No secrets in repo | Secret scanning | CI secret scan |
| Incident Response | Playbooks | Docs | Manual review |

## Assumed Limitations

- This is a portfolio demo, not a certified product.
- Authentication uses explicitly enabled seeded demo accounts. It is suitable only for the controlled synthetic sandbox; a real product would use OIDC with MFA or passkeys.
- Uploads currently use base64 JSON payloads for demo simplicity. Production upload transport should move to multipart or presigned upload URLs with the same validation and scan pipeline.
- Malware scanning uses a documented mock worker instead of ClamAV.
