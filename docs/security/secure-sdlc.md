# Secure SDLC

## Objective

Security must be part of the development process, not a final check added after the code is done.

## Requirements for Changes

- Every new feature that touches tenant-scoped data includes threat notes.
- Every new endpoint has authentication and authorization tests.
- Every business model has `tenant_id` where applicable.
- Every public response uses DTO allowlists.
- Every secret or token is redacted from logs.
- Every upload/download has an audit event.

## Pull Request Checklist

- [ ] New endpoints require auth.
- [ ] Authorization is checked through the policy layer.
- [ ] Queries are tenant-scoped.
- [ ] There is no `findById(id)` without tenant context for business resources.
- [ ] DTOs do not expose internal fields.
- [ ] Negative tests exist for denied access.
- [ ] Audit events are created for sensitive actions.
- [ ] Secrets are not logged.
- [ ] New config is validated at startup.
- [ ] Relevant documentation is updated.

## CI and Security Pipeline

Implemented pipeline:

1. install dependencies
2. lint checks
3. type checks
4. unit tests
5. integration tests
6. PostgreSQL-backed RLS tests
7. authorization tests
8. dependency scan
9. secret scan
10. CodeQL SAST
11. Trivy filesystem dependency/configuration scan with SARIF upload
12. build
13. non-blocking OWASP ZAP baseline against ephemeral local services
14. security report artifact

Workflow files:

- `.github/workflows/ci.yml`
- `.github/workflows/security.yml`
- `.github/dependabot.yml`

The repository also contains `.github/workflows/deploy-home-server.yml`. It is manual-only and guarded to `main`, but it is inactive until a dedicated trusted runner is installed. Deployment is not part of the blocking CI pipeline.

## Release Hardening

- Verify security headers.
- Verify CORS allowlist.
- Verify CSRF protection.
- Run demo seed and the main scenario.
- Run cross-tenant tests.
- Review the risk register.
- Verify that documentation distinguishes the in-memory runtime from the PostgreSQL/RLS test path.
- Verify the Cloudflare/Caddy client-IP trust configuration or use DNS-only operation.
