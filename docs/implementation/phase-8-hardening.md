# Phase 8: Frontend and Backend Hardening

Phase 8 adds baseline browser, request, and session safety controls for the demo API and web client.

## Implemented Scope

- Security headers are applied to API responses:
  - `Content-Security-Policy`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `Cross-Origin-Resource-Policy`
  - `Strict-Transport-Security` in production
- CORS remains allowlisted to local web origins and now allows `X-CSRF-Token`.
- Session login sets a readable CSRF cookie alongside the HttpOnly session cookie.
- Browser-origin mutating requests with session cookies must send `X-CSRF-Token`.
- API key Bearer requests are excluded from CSRF checks.
- Request body size is limited at the Fastify boundary.
- Error responses use stable error codes and do not expose stack traces.
- The web client sends CSRF tokens for mutating session-backed requests.

## Security Notes

- CSRF is enforced for credentialed browser requests detected by an allowed `Origin` header.
- Public share-link reads and external API key calls remain usable without CSRF tokens.
- The demo uses a double-submit CSRF token pattern because the web and API run on separate local ports.
- The CSP on API responses is intentionally strict because API routes should not render active browser content.

## Verification

- Tests cover security headers, CORS allowed headers, CSRF rejection and acceptance, request body limits, and no stack trace leakage.
- Existing authorization, tenant isolation, file, share-link, API key, and dashboard tests continue to pass.

## Remaining Hardening

- Add frontend CSP headers through Next.js middleware or hosting config.
- Add rate limiting for auth, API key, share-link, and upload endpoints.
- Add structured request logging with redaction.
- Add schema validation for all request bodies and query strings.
