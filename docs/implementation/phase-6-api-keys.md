# Phase 6 API Keys and External API

Phase 6 adds tenant-scoped API keys for a small external documents API.

## Implemented Controls

- API keys use generated `tv_live_...` values.
- The full key is returned only once during creation.
- Stored records contain only `key_hash`.
- API key list and revoke responses never expose `key_hash`.
- Scopes are explicit: `documents:read`, `documents:write`, and `audit:read`.
- External API requests require `Authorization: Bearer <key>`.
- Revoked and expired keys are rejected.
- Successful external API usage updates `lastUsedAt`.
- API key creation, revocation, successful usage, and denied usage are audited.
- Audit metadata includes only `keyPrefix`, never the full key.

## API Surface

Authenticated tenant APIs:

- `GET /api-keys`
- `POST /api-keys`
- `DELETE /api-keys/:apiKeyId`

External API:

- `GET /api/v1/documents`
- `POST /api/v1/documents`

## Security Notes

The API key token includes an opaque tenant hint so the repository can set tenant context before hash lookup. PostgreSQL RLS remains active during API key resolution.

Read-only keys cannot create documents. Write-scoped keys can create documents only inside the key's tenant. Responses filter storage internals and never return private object paths.
