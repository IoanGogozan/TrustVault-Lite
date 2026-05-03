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

## CI/CD Security Pipeline

Target pipeline:

1. install
2. lint
3. unit tests
4. integration tests
5. authorization tests
6. dependency scan
7. secret scan
8. SAST
9. container scan
10. build
11. OWASP ZAP baseline
12. generate security report artifact

## Release Hardening

- Verify security headers.
- Verify CORS allowlist.
- Verify CSRF protection.
- Run demo seed and the main scenario.
- Run cross-tenant tests.
- Review the risk register.

