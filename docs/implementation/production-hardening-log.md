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

Known gaps are tracked as release blockers in `docs/operations/production-deployment.md`. This milestone does not authorize public exposure.
