# Demo Script

This is the main portfolio or interview demo scenario.

Open `https://vault.norvix.no` for the portfolio overview, then use **Launch interactive demo** or navigate directly to `https://vault.norvix.no/demo`.

## Flow

1. Log in as Owner in the `Acme Corp` tenant.
2. Create a new evidence project from the web UI.
3. Create a document in that project and upload the demo PDF.
4. Trigger the authenticated document scan action and show the file becoming downloadable without exposing a worker secret to the browser.
5. Prepare a download and show that the UI receives expiring download metadata, then downloads the file through the API proxy without exposing the private storage key.
6. Create a share link for the clean document.
7. Show that the raw share token appears only once.
8. Use the public share link and show that the file downloads through the API proxy without exposing storage internals.
9. Revoke the share link and show that later public access is denied.
10. Show the audit viewer with `project.created`, `document.created`, `document.uploaded`, `document.scan_queued`, `document.scan_clean`, `document.downloaded`, `share_link.created`, `share_link.used`, and `share_link.revoked`.
11. Log out and select the seeded Viewer account.
12. Show that the Viewer can download clean documents but cannot upload or create share links.
13. Try to access a document from another tenant by changing the ID manually.
14. The API returns `403`.
15. The audit viewer shows the authorization denial.
16. Log in as Owner and create an API key with only the `documents:read` scope.
17. Show that the full key is displayed only once and list responses expose only the prefix.
18. Call `GET /api/v1/documents` with the key and show tenant-scoped results.
19. Try `POST /api/v1/documents` with the read-only key.
20. The API returns `403`.
21. Revoke the key and show that later API use is rejected.
22. Open the security dashboard and audit log.
23. Show the CI pipeline with security checks.

## Presentation Message

TrustVault Lite is not presented as a certified product. It is an ASVS-inspired demo that shows verifiable controls for tenant isolation, authorization, secure upload handling, auditability, and secure SDLC.

## Supporting Assets

- Demo accounts: `docs/product/demo-accounts.md`
- Architecture and trust boundaries: `docs/security/architecture.md`
