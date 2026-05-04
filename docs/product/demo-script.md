# Demo Script

This is the main portfolio or interview demo scenario.

## Flow

1. Log in as Owner in the `Acme Corp` tenant.
2. Create a new evidence project from the web UI.
3. Create a document in that project and upload the demo PDF.
4. Process the mock scan job and show the file becoming downloadable.
5. Prepare a download and show that the UI receives expiring download metadata, then downloads the file through the API proxy without exposing the private storage key.
6. Create a share link for the clean document.
7. Show that the raw share token appears only once.
8. Use the public share link and show that the file downloads through the API proxy without exposing storage internals.
9. Revoke the share link and show that later public access is denied.
10. Show the audit viewer with `project.created`, `document.created`, `document.uploaded`, `document.scan_queued`, `document.scan_clean`, `document.downloaded`, `share_link.created`, `share_link.used`, and `share_link.revoked`.
11. Invite a user with the `Viewer` role.
12. Log in as Viewer.
13. Show that the Viewer can download clean documents but cannot upload or create share links.
14. Try to access a document from another tenant by changing the ID manually.
15. The API returns `403`.
16. The audit viewer shows the authorization denial.
17. Create an API key with only the `documents:read` scope.
18. Show that the full key is displayed only once and list responses expose only the prefix.
19. Call `GET /api/v1/documents` with the key and show tenant-scoped results.
20. Try `POST /api/v1/documents` with the read-only key.
21. The API returns `403`.
22. Revoke the key.
23. Show that later API use is rejected.
24. Open the security dashboard.
25. Show denied access activity, file scan status, active share links, active API keys, and risky events.
26. Show the complete audit log with filters for actor, action, and result.
27. Show the CI pipeline with security checks.

## Presentation Message

TrustVault Lite is not presented as a certified product. It is an ASVS-inspired demo that shows verifiable controls for tenant isolation, authorization, secure upload handling, auditability, and secure SDLC.

## Supporting Assets

- Demo accounts: `docs/product/demo-accounts.md`
- Portfolio screenshot and video checklist: `docs/product/portfolio-assets.md`
- Architecture diagram: `docs/assets/trustvault-security-architecture.svg`
