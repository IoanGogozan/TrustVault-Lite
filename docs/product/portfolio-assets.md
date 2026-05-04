# Portfolio Assets

This document tracks the supporting material needed to present TrustVault Lite as a portfolio project.

## Screenshots

Capture these views after running the demo flow:

| Asset | View | What it should show |
| --- | --- | --- |
| `01-login.png` | Login | Product name and development demo login. |
| `02-evidence-workspace.png` | Evidence workspace | Tenant switcher, project creation, document upload, and document actions. |
| `03-share-links-api-keys.png` | Share links and API keys | One-time token/key display and revoke controls. |
| `04-audit-events.png` | Audit events | Lifecycle events and authorization denial evidence. |
| `05-security-dashboard.png` | Security dashboard | MFA coverage, denied access, scan status, API keys, share links, and risky events. |
| `06-github-actions.png` | GitHub Actions | CI and Security workflows with pipeline checks. |

Recommended destination:

```text
docs/assets/screenshots/
```

## Demo Video Shot List

Target length: 2 to 4 minutes.

1. Open the README and show the positioning statement.
2. Start the app and log in as `owner@acme.test`.
3. Create a project and upload a document.
4. Show scan completion, prepare download metadata, and download the file through the API proxy.
5. Create and use a share link, then revoke it.
6. Create a read-only API key and show scoped access.
7. Trigger a denied action or cross-tenant access attempt.
8. Show the audit log and security dashboard.
9. Open the GitHub Actions security pipeline.

## Architecture Asset

The architecture diagram is stored at:

```text
docs/assets/trustvault-security-architecture.svg
```

It is referenced from the README and the architecture document.

## Review Checklist

- The README explains what is implemented and what is intentionally scoped as a demo.
- Demo accounts are documented.
- The demo script is reproducible from a clean checkout.
- The security controls matrix maps controls to implementation and tests.
- CI and security workflows are visible in GitHub Actions.
- Screenshots and video show evidence, not only marketing copy.
