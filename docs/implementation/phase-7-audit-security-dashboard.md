# Phase 7: Audit Logs and Security Dashboard

Phase 7 adds tenant-scoped audit filtering and a security dashboard that turns raw audit events into demo-ready security signals.

## Implemented Scope

- `GET /audit-events` supports filtering by `actorType`, `action`, `result`, and `limit`.
- `GET /security-dashboard` requires `security:read`.
- Dashboard metrics include MFA coverage, access denied events, file scan status, active API keys, and active share links.
- Risky events highlight denied access, API key lifecycle changes, share link activity, and blocked file scans.
- Simple alert rules flag access denied activity, active API keys, and active public share links.
- The web UI shows security metrics, alerts, risky events, and the existing audit event stream.

## Security Notes

- Audit responses remain tenant-scoped.
- Dashboard access is role-gated through the centralized policy layer.
- Audit metadata is still redacted before storage.
- The dashboard summarizes security-relevant signals without exposing secrets, raw tokens, API key hashes, or storage keys.

## Verification

- API tests cover audit filtering, dashboard metrics, alert output, risky events, and permission denial.
- Web type checks cover the dashboard response contract used by the UI.

## Remaining Hardening

- Move audit query and dashboard calculation into a dedicated repository/service when PostgreSQL-backed audit event queries are introduced.
- Add persisted alert acknowledgements.
- Add time windows for metrics such as last 24 hours and last 7 days.
