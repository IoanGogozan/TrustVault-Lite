# Demo Script

This is the main portfolio or interview demo scenario.

## Flow

1. Log in as Owner in the `Acme Corp` tenant.
2. Show that the tenant requires MFA or that the user has MFA enabled.
3. Create the `SOC 2 Evidence` project.
4. Upload a PDF.
5. Show the `pending_scan` status, then `clean`.
6. Invite a user with the `Viewer` role.
7. Log in as Viewer.
8. Show that the Viewer can download the document but cannot upload.
9. Try to access a document from another tenant by changing the ID manually.
10. The API returns `403`.
11. The security dashboard shows `document.cross_tenant_denied`.
12. Create an API key with only the `documents:read` scope.
13. Try `DELETE /api/v1/documents/:id` with that key.
14. The API returns `403`.
15. Revoke the key.
16. Show the complete audit log.
17. Show the CI pipeline with security checks.

## Presentation Message

TrustVault Lite is not presented as a certified product. It is an ASVS-inspired demo that shows verifiable controls for tenant isolation, authorization, secure upload handling, auditability, and secure SDLC.

