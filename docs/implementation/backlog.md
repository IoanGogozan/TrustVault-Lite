# Backlog

## MVP 1: SaaS Foundation

- Simple landing page.
- Register/login through OIDC or Auth.js.
- Create organization.
- Tenant switcher.
- Invite user by email.
- Accept invite.
- Roles: Owner, Admin, Member, Viewer, Auditor.
- Tenant dashboard.

Security focus:

- users cannot see tenants where they are not members;
- all queries are tenant-scoped;
- all endpoints require authentication;
- deny by default.

## MVP 2: Document Vault

- Projects.
- Upload document.
- Simple file versioning.
- Secure download.
- Soft delete.
- File scan status.
- Audit events for upload/download/delete.

Security focus:

- private files;
- expiring signed URLs;
- file validation;
- scan before download;
- documents cannot be accessed cross-tenant.

## MVP 3: Authorization Hardening

- Centralized policy layer.
- Tests for each role.
- Tests for cross-tenant access.
- Tests for API object ID manipulation.
- Field-level response filtering.

Security focus:

- prevent IDOR/BOLA;
- prevent mass assignment;
- avoid accidental exposure of sensitive fields;
- every access denied event is written to the audit log.

## MVP 4: Security Dashboard

- Audit log viewer.
- Security events page.
- API key management.
- Active sessions page.
- MFA status page.
- Share links page.

Security focus:

- visibility;
- traceability;
- fast revocation;
- evidence for security controls.

## MVP 5: DevSecOps

- GitHub Actions.
- Lint and tests.
- Dependency scan.
- Secret scanning.
- SAST.
- Container scan.
- OWASP ZAP baseline scan.
- SBOM.
- Security checklist in README.

Security focus:

- security is part of the process, not only the code.

