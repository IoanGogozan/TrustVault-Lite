# Demo Accounts

TrustVault Lite uses seeded accounts for portfolio walkthroughs. The `/auth/dev-login` endpoint is enabled in production only when the separate `DEMO_MODE=true` switch explicitly authorizes the controlled synthetic sandbox; otherwise it returns `404`.

## Accounts

| Email | Tenant | Role | Purpose |
| --- | --- | --- | --- |
| `owner@acme.test` | Acme Corp | Owner | Full tenant administration, document lifecycle, API keys, share links, and security dashboard. |
| `admin@acme.test` | Acme Corp | Admin | Project and document management without owner-level role control. |
| `member@acme.test` | Acme Corp | Member | Document create/read/update within assigned project scope. |
| `viewer@acme.test` | Acme Corp | Viewer | Read-only evidence access for role-boundary demonstrations. |
| `auditor@acme.test` | Acme Corp | Auditor | Read-only evidence access plus audit and security visibility. |
| `owner@globex.test` | Globex | Owner | Separate tenant used for cross-tenant isolation checks. |

## Recommended Demo Path

1. Start with `owner@acme.test`.
2. Create a project and upload a document.
3. Generate a share link and API key.
4. Switch to `viewer@acme.test` to show read-only behavior.
5. Use Globex identifiers in Acme context to demonstrate `403` authorization denials.
6. Return to `owner@acme.test` to show audit events and security dashboard signals.

## Security Notes

- Demo accounts are seeded in the in-memory sandbox store and reset when the API restarts.
- No real passwords are used by the demo login flow.
- Production identity is expected to use OIDC Authorization Code Flow with MFA or passkeys.
- Tenant membership, role, and project scope are still enforced in the API for demo accounts.
