# Security Test Plan

## Unit Tests

- `can()` allows only explicitly defined actions.
- `can()` denies by default.
- wildcard permissions work only for the correct area.
- response DTO does not include sensitive fields.
- API key hash/verify works without exposing the key.

## Integration Tests

- unauthenticated user receives `401`.
- user without membership receives `403`.
- user cannot select a foreign tenant.
- document ID from another tenant returns `403` or `404`.
- PostgreSQL repository query without tenant context fails in database-backed tests.
- API key from tenant A cannot access tenant B.
- viewer cannot upload.
- auditor cannot create documents.
- admin cannot modify owner.

## File Upload Tests

- file that is too large is rejected.
- forbidden extension is rejected.
- MIME mismatch is rejected.
- `pending_scan` file cannot be downloaded.
- `blocked` file cannot be downloaded.
- storage key is not exposed in API response.
- share link expiry prevents download.
- clean files can be downloaded through the API proxy without exposing storage keys.

## API Security Tests

- key without `documents:write` cannot create documents.
- revoked key does not work.
- expired key does not work.
- rate limiting applies to the configured subject for login, API-key administration, external API, share links, and uploads.
- forwarded client IPs receive separate login buckets when Fastify is behind the single trusted Caddy hop.
- request body with extra fields cannot modify forbidden properties.
- full key does not appear in logs.

## Browser/HTTP Tests

- CSP is present.
- production web configuration includes HSTS.
- `X-Content-Type-Options: nosniff` is present.
- `X-Frame-Options: DENY` is present.
- CORS blocks unknown origin.
- mutating request without CSRF token is blocked.
- browser-like mutating request without origin is blocked.
- internal scan endpoints require worker authorization.
- Caddy returns `404` for public `/api/internal/*` requests.
- rate limiting does not use raw bearer tokens as limiter keys.
- errors do not expose stack traces in production.

## CI Security Checks

- dependency scan.
- secret scan.
- SAST.
- Trivy filesystem dependency/configuration scan.
- non-blocking OWASP ZAP baseline.
