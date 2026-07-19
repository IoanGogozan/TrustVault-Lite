# Production deployment runbook

## Status

Target URL: `https://vault.norvix.no`

This repository now contains a validated production container foundation, but public deployment is intentionally blocked until production authentication and complete durable persistence are implemented and tested. Setting `NODE_ENV=development` to bypass this gate is unsafe because the development login does not require a password.

## Architecture

Internet traffic reaches only Caddy on TCP 80/443 and UDP 443. Caddy obtains and renews the TLS certificate, routes `/api/*` to Fastify, and routes all other requests to Next.js. Web and API share one browser origin, reducing CORS and cookie complexity. PostgreSQL is attached only to an internal Docker network and has no host port.

The production stack is defined in `infra/docker/docker-compose.production.yml`:

- `caddy`: TLS termination, security headers, compression, access logs, and reverse proxy;
- `web`: standalone Next.js server running as the unprivileged `node` user;
- `api`: compiled Fastify server running as the unprivileged `node` user;
- `migrate`: one-shot migration job that must succeed before the API starts;
- `postgres`: PostgreSQL 17 with a persistent named volume and no published port.

## Release blockers

- Replace the development-only email login with production authentication. The selected design must support strong password hashing or standards-based OIDC, MFA, generic login errors, throttling, session rotation, expiry, and revocation.
- Persist users, tenants, memberships, sessions, invitations, audit events, scan jobs, rate-limit state, and every other domain record. Several routes still use the in-memory demo store directly.
- Wire all existing PostgreSQL repositories in the production composition root.
- Replace in-memory object storage with private S3-compatible storage and verify backup/restore.
- Replace the marker-based demo scanner with an isolated malware scanning service and a durable queue.
- Add frontend component/end-to-end tests and run an authenticated DAST pass.
- Add database-aware readiness checks; `/health` currently proves only that the API process responds.
- Complete restore testing, log retention, monitoring, alerting, and an upgrade/rollback rehearsal.

## Host prerequisites

- A maintained Linux server with Docker Engine and the Compose plugin.
- Router forwarding TCP 80, TCP 443, and optionally UDP 443 to the server.
- DNS `A` and, only if IPv6 ingress is configured, `AAAA` records for `vault.norvix.no` pointing to the home connection.
- No competing service bound to host ports 80 or 443.
- A firewall allowing SSH only from trusted sources and allowing public ingress only on 80/443.
- Time synchronization enabled; TLS and session controls depend on correct time.

Do not publish an `AAAA` record if the server cannot accept IPv6 traffic. Do not expose PostgreSQL, the API port, the web port, Docker daemon, or Caddy admin API.

## Secret preparation

Copy `infra/docker/.env.production.example` to `infra/docker/.env.production` on the server. The destination is ignored by Git. Generate independent values; never reuse passwords.

Example generation on Linux:

```sh
openssl rand -base64 48
```

Restrict the file before adding secrets:

```sh
chmod 600 infra/docker/.env.production
```

Required values:

- `APP_DOMAIN=vault.norvix.no`;
- `ACME_EMAIL`: operational address for certificate notices;
- `POSTGRES_PASSWORD`: database owner credential;
- `APP_DATABASE_PASSWORD`: least-privileged application role credential;
- `INTERNAL_WORKER_TOKEN`: independent random worker credential of at least 32 bytes.

Compose environment variables are an interim local-server mechanism. Migration to Docker secrets or another secret manager remains an operations hardening item.

## Validation commands

These commands validate the stack but must not be used for public release while blockers remain:

```sh
docker compose \
  --env-file infra/docker/.env.production \
  -f infra/docker/docker-compose.production.yml \
  config --quiet

docker compose \
  --env-file infra/docker/.env.production \
  -f infra/docker/docker-compose.production.yml \
  build --pull
```

Once the release gate is cleared, start with:

```sh
docker compose \
  --env-file infra/docker/.env.production \
  -f infra/docker/docker-compose.production.yml \
  up -d
```

Then verify container health, migration completion, HTTPS redirect, certificate chain, security headers, authentication, authorization boundaries, upload/download scanning, audit creation, backup, and restore.

## Backup and recovery gate

Before release, implement encrypted scheduled backups for PostgreSQL and object storage to a device or location independent of the server. A backup is not accepted until a restore into a clean environment succeeds and the restored tenant/document hashes are verified. Caddy certificate state can be recreated, but retaining its volume avoids unnecessary ACME issuance.

## Rollback

Application images must be tagged immutably for releases. Database migrations must be reviewed for backward compatibility before deployment. Rollback means restoring the previous image tag; if a migration is destructive, restore the tested pre-deploy database backup instead of attempting an ad-hoc downgrade.
