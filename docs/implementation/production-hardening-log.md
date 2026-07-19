# Production hardening log

## 2026-07-18 — deployment foundation

Decision: use `vault.norvix.no` and a same-origin Caddy reverse proxy on ports 80/443.

Implemented:

- added multi-stage API and standalone Next.js container builds;
- configured both application containers to run as the unprivileged `node` user with read-only filesystems, dropped capabilities, and no-new-privileges;
- added Caddy TLS termination, routing, compression, security headers, and JSON access logs;
- isolated PostgreSQL on an internal Docker network without a published host port;
- added health checks and ordered startup through a one-shot migration service;
- replaced the fixed application-role password in the migration path with a supplied value while retaining a development default;
- made `PUBLIC_ORIGIN` mandatory and HTTPS-only in production;
- made browser origin validation configurable for `https://vault.norvix.no`;
- added configuration security tests and a production environment template;
- documented host, DNS, firewall, secret, backup, validation, and rollback requirements.

Verification performed:

- unit/API tests;
- TypeScript checks and production application build;
- Compose interpolation and schema validation;
- production container image builds (including correction of Linux workspace dependency linking found during image validation).

The operational checklist is tracked in `docs/operations/production-deployment.md`.

## 2026-07-19 — controlled public sandbox

- separated `DEMO_MODE` from `NODE_ENV` with strict startup validation;
- enabled seeded login in production only through explicit demo configuration;
- blocked organization and invitation creation in the public sandbox;
- removed the internal worker token and internal scan endpoint from the browser flow;
- added an authenticated, authorization-checked mock scan action for documents;
- blocked `/api/internal/*` at Caddy;
- added synthetic-data/reset warnings and a guided security-control walkthrough;
- documented single-instance, in-memory operation as an intentional sandbox boundary;
- added tests for production demo gating, locked sandbox mutations, and token-free scanning.

## 2026-07-19 — Norvix server integration

- aligned TrustVault with the existing shared Caddy container and external `proxy` network;
- added a home-server Compose file with no public host ports;
- added stable `trustvault-web` and `trustvault-api` network aliases;
- added a Caddy site fragment for `vault.norvix.no`;
- added a manual-only, `main`-guarded self-hosted deployment workflow;
- preserved server-managed secrets outside GitHub and added deployment preflight checks.

## 2026-07-19 — proxy-aware client identity

- configured Fastify to trust exactly the single Caddy hop in front of the API;
- ensured rate limits and audit IP hashes use the identity forwarded by the single trusted Caddy hop instead of the Caddy container address;
- added a regression test proving different forwarded client IPs receive separate login rate-limit buckets;
- documented that a CDN in front of Caddy requires its own trusted-proxy policy or DNS-only operation before the forwarded address can be treated as the end-user IP.

## 2026-07-19 — documentation consolidation

- aligned all documentation with the live in-memory runtime and the separately tested PostgreSQL/RLS path;
- documented the actual Cloudflare, shared Caddy, SSH deployment, and inactive dedicated-runner state;
- qualified mock scanning, non-blocking ZAP, non-durable audit data, and rollback behavior;
- removed the stale definition-of-done checklist, uncreated portfolio-asset checklist, generic incident-response placeholder, and misleading mixed current/future SVG architecture diagram;
- consolidated the maintained runtime architecture into `docs/security/architecture.md`.
