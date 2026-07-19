# TrustVault Lite

TrustVault Lite is a B2B multi-tenant SaaS portfolio demo built as a secure client evidence portal for confidential documents, compliance evidence, contracts, and reports.

The goal is to demonstrate real security controls in a small product. This project does not claim certification or formal compliance.

Portfolio landing page: [https://vault.norvix.no](https://vault.norvix.no). The interactive sandbox is available at [`/demo`](https://vault.norvix.no/demo). Use synthetic data only; application state is intentionally ephemeral and resets when the API restarts.

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
- PostgreSQL repositories, migrations, and Row Level Security tests as a defense-in-depth implementation path.
- Synthetic PDF upload validation, server-side mock scanning, and private in-memory object storage.
- Proxy downloads for clean files without exposing storage keys.
- Hashed API keys with scopes, expiry, and revocation.
- Audit logs and security dashboard.
- Explicitly gated seeded demo login, secure cookies, CSRF protection, and session revocation.
- CI and security workflows with linting, tests, dependency auditing, secret scanning, CodeQL, Trivy filesystem/configuration scanning, and a non-blocking ZAP baseline.

## Documentation

- [Product brief](docs/product/product-brief.md)
- [Demo script](docs/product/demo-script.md)
- [Demo accounts](docs/product/demo-accounts.md)
- [Implemented controls](docs/implementation/implemented-controls.md)
- [Security overview](docs/security/README.md)
- [Threat model](docs/security/threat-model.md)
- [Architecture](docs/security/architecture.md)
- [ASVS mapping](docs/security/asvs-mapping.md)
- [Risk register](docs/security/risk-register.md)
- [Security test plan](docs/security/security-test-plan.md)
- [Secure SDLC](docs/security/secure-sdlc.md)

## Architecture

The implemented runtime and the separately tested PostgreSQL/RLS path are documented in [the security architecture](docs/security/architecture.md). Future OIDC, Redis, S3, and malware-scanner integrations are labelled as extension points rather than runtime components.

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
    caddy/
    migrations/
  docs/
    product/
    implementation/
    security/
  .github/
    workflows/
```

## Implemented Demo Scope

- Seeded login for local development and the explicitly enabled controlled public sandbox.
- Tenant switcher with membership enforcement.
- Centralized authorization policy layer with role-boundary tests.
- PostgreSQL repositories, RLS migration, and database-backed cross-tenant tests; the public sandbox deliberately uses the in-memory adapters.
- Project and document lifecycle with authenticated server-side mock scan processing.
- Private storage abstraction backed by in-memory objects in the sandbox, expiring download metadata, and proxy download endpoints.
- Share links with opaque hashed tokens, public-safe responses, expiry, revocation, and max-download controls.
- API keys with hashed storage, one-time display, scopes, expiry, revocation, and external API usage.
- Audit events and security dashboard for security-relevant activity, including auth, invitation, role-change, API key, share-link, and document lifecycle events.
- Browser/API hardening with CSP, security headers, CORS, CSRF, rate limits, shape validation, and log redaction.
- GitHub Actions CI and security workflows plus a manual home-server deploy definition that requires a dedicated trusted runner.

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

The controlled public sandbox is live at `https://vault.norvix.no`. Public traffic currently passes through Cloudflare to the shared Caddy origin on TCP 80/443 and UDP 443. `DEMO_MODE=true` explicitly enables seeded-account login independently of `NODE_ENV=production`; without it, the demo login returns `404`. The deployment checklist is documented in [the production deployment runbook](docs/operations/production-deployment.md).

The public sandbox accepts synthetic data only, runs as a single instance, resets its in-memory state on restart, and disables organization and invitation creation.

The Norvix home server uses its existing shared Caddy proxy and `infra/docker/docker-compose.home-server.yml`; it must not start the standalone Caddy service because the shared proxy already owns ports 80/443. The API trusts exactly the single Caddy hop. Correct end-user IP attribution while Cloudflare proxying is enabled additionally requires a trusted-Cloudflare policy at Caddy and restricted direct-origin access; DNS-only operation is the simpler documented baseline.

The initial live deployment was performed through key-only SSH from the trusted LAN. The repository includes a manual-only, `main`-guarded self-hosted workflow, but it remains inactive until a dedicated trusted TrustVault runner is installed. The existing `norvix` runner is not shared with this public repository.

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
| Auth | Gated demo login + session controls | Seeded sandbox auth flow | Login/session tests |
| Sessions | Secure cookies | BFF/session config | Header tests |
| Authorization | RBAC + ABAC | `can()` policy layer | Role tests |
| Tenant isolation | RLS + `tenant_id` | PostgreSQL policies | Cross-tenant tests |
| API Security | Scoped API keys | Hash + scopes + expiry | API integration tests |
| File Security | Validation + mock scanning | Authenticated server-side scan action | Upload/scan tests |
| Data Protection | Private storage abstraction | In-memory sandbox objects + proxy downloads | Download tests |
| Auditability | Audit events | Audit service | Audit assertions |
| Browser Security | CSP + headers | Middleware | Header tests |
| DevSecOps | Security scans in CI | GitHub Actions; ZAP is non-blocking | Pipeline artifacts |
| Secrets | No secrets in repo | Secret scanning | CI secret scan |
| Incident Response | Playbooks | Docs | Manual review |

## Assumed Limitations

- This is a portfolio demo, not a certified product.
- Authentication uses explicitly enabled seeded demo accounts. It is suitable only for the controlled synthetic sandbox; a real product would use OIDC with MFA or passkeys.
- Uploads currently use base64 JSON payloads for demo simplicity. Production upload transport should move to multipart or presigned upload URLs with the same validation and scan pipeline.
- Malware scanning uses a documented mock worker instead of ClamAV.
- Runtime sessions, rate limits, audit events, projects, documents, API keys, share links, and stored objects are in memory and reset with the single API instance.
- PostgreSQL persistence and RLS-backed repositories are implemented and tested, but are not wired as the runtime adapters for the public sandbox.
- The public deployment is intentionally single-instance and is not designed for durable user data or horizontal scaling.
