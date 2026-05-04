# Demo Script

This is the main portfolio or interview demo scenario.

## Flow

1. Log in as Owner in the `Acme Corp` tenant.
2. Show that the tenant requires MFA or that the user has MFA enabled.
3. Create a new evidence project from the web UI.
4. Create a document in that project and upload the demo PDF.
5. Process the mock scan job and show the file becoming downloadable.
6. Prepare a download and show that the UI receives expiring download metadata without exposing the private storage key.
7. Show the audit viewer with `project.created`, `document.created`, `document.uploaded`, `document.scan_queued`, `document.scan_clean`, and `document.downloaded`.
8. Invite a user with the `Viewer` role.
9. Log in as Viewer.
10. Show that the Viewer can download clean documents but cannot upload.
11. Try to access a document from another tenant by changing the ID manually.
12. The API returns `403`.
13. The audit viewer shows the authorization denial.
14. Create an API key with only the `documents:read` scope.
15. Try `DELETE /api/v1/documents/:id` with that key.
16. The API returns `403`.
17. Revoke the key.
18. Show the complete audit log.
19. Show the CI pipeline with security checks.

## Presentation Message

TrustVault Lite is not presented as a certified product. It is an ASVS-inspired demo that shows verifiable controls for tenant isolation, authorization, secure upload handling, auditability, and secure SDLC.
