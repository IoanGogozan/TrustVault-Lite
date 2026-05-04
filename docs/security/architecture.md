# Architecture

## Context

TrustVault Lite is a portfolio demo for a secure multi-tenant evidence portal. The implemented local architecture uses a Next.js web app, a TypeScript API, PostgreSQL with RLS for database-backed tests, private object storage abstractions, an in-process scan queue/worker, audit events, and CI security workflows.

Production identity is intentionally not implemented in this demo. The production path is OIDC Authorization Code Flow with MFA or passkeys through an external identity provider.

## Implemented Component Diagram

![TrustVault Lite security architecture](../assets/trustvault-security-architecture.svg)

```mermaid
flowchart LR
  Browser[Browser] --> Web[Next.js Web App]
  Web --> API[Secure API]
  API --> Auth[Development Session Auth]
  API --> Policy[Authorization Layer]
  Policy --> DB[(PostgreSQL + RLS)]
  API --> Storage[(Private Object Storage)]
  API --> Queue[In-process Scan Queue]
  Queue --> Worker[Mock Scan Worker]
  Worker --> Storage
  Worker --> DB
  API --> Audit[(Audit Events)]
  API --> Logs[Structured Logs]
```

## Production Extension Points

The codebase includes explicit boundaries for production-grade components without claiming they are wired in the local demo:

- OIDC provider for production authentication.
- Redis-compatible rate limiter adapter for multi-instance rate limits.
- S3/MinIO-compatible storage adapter.
- ClamAV or equivalent scanner behind the scan worker boundary.

## Demo Auth Flow

```mermaid
sequenceDiagram
  participant U as User
  participant W as Web
  participant A as API

  U->>W: Select seeded demo account
  W->>A: POST /auth/dev-login
  A->>A: Create server-side session
  A-->>W: HttpOnly Secure SameSite cookie + CSRF cookie
```

The `/auth/dev-login` endpoint is disabled in production mode.

## Tenant Request Flow

```mermaid
sequenceDiagram
  participant W as Web/API Client
  participant A as API
  participant P as Policy Layer
  participant D as PostgreSQL

  W->>A: Request with selected tenant
  A->>A: Authenticate actor
  A->>A: Verify active membership
  A->>P: can(actor, action, resource)
  P-->>A: allow/deny
  A->>D: set_config(app.current_tenant_id)
  D-->>A: tenant-scoped result
  A-->>W: Response DTO allowlist
```

## Upload Flow

```mermaid
sequenceDiagram
  participant U as User
  participant A as API
  participant S as Storage
  participant Q as Queue
  participant W as Worker
  participant DB as Database

  U->>A: Upload base64 demo payload
  A->>A: Authz + file validation
  A->>S: Store private object
  A->>DB: Create version pending_scan
  A->>Q: Enqueue scan job
  Q->>W: Process job
  W->>S: Read object
  W->>W: Mock scan
  W->>DB: Mark clean or blocked
```

## Download Flow

1. Actor requests download metadata or proxy file content.
2. API authenticates the actor or validates the public share token.
3. API verifies tenant, role, project, share-link state, and scan status.
4. API refuses files that are not `clean`.
5. API streams clean content through a proxy endpoint without exposing storage keys.
6. API writes an audit event.

## Data Model

Main tables:

- `users`
- `tenants`
- `memberships`
- `projects`
- `documents`
- `document_versions`
- `share_links`
- `api_keys`
- `audit_events`
## Browser Hardening

Implemented headers:

- `Content-Security-Policy`
- `Strict-Transport-Security` in production web responses
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
