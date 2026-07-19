# Production deployment runbook

## Status

Target URL: `https://vault.norvix.no`

This deployment is a controlled, ephemeral portfolio sandbox, not a production SaaS service. `NODE_ENV=production` enables runtime hardening while the separate `DEMO_MODE=true` switch explicitly enables seeded demo login. The sandbox accepts synthetic data only, runs one API instance, keeps application state in memory, and resets on restart.

## Architecture

Internet traffic reaches only Caddy on TCP 80/443 and UDP 443. Caddy obtains and renews the TLS certificate, routes `/api/*` to Fastify, and routes all other requests to Next.js. Web and API share one browser origin, reducing CORS and cookie complexity. PostgreSQL is attached only to an internal Docker network and has no host port.

The production stack is defined in `infra/docker/docker-compose.production.yml`:

- `caddy`: TLS termination, security headers, compression, access logs, and reverse proxy;
- `web`: standalone Next.js server running as the unprivileged `node` user;
- `api`: compiled Fastify server running as the unprivileged `node` user;
- `migrate`: one-shot migration job that must succeed before the API starts;
- `postgres`: PostgreSQL 17 with a persistent named volume and no published port.

## Public sandbox release gate

- `NODE_ENV=production`, `DEMO_MODE=true`, and `PUBLIC_ORIGIN=https://vault.norvix.no` are set.
- Web and API are served through the same Caddy origin; API and web ports are not published directly.
- The browser bundle contains no internal worker token and Caddy blocks `/api/internal/*`.
- Organization and invitation creation return `404` in the public sandbox.
- The UI clearly states synthetic-only use and restart-based reset behavior.
- Only one API replica runs. In-memory sessions, rate limits, objects, scan jobs, and audit events are intentionally non-durable.
- Unit/API tests, PostgreSQL RLS integration tests, type checks, production builds, container health checks, and an unauthenticated DAST baseline pass.
- DNS, port forwarding, firewall rules, TLS issuance, restart behavior, and log redaction are verified from outside the home network.

OIDC, Redis, S3, ClamAV, multipart uploads, multi-instance scaling, and durable application state are documented extension points, not requirements for this synthetic portfolio sandbox.

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
- `DEMO_MODE=true`: explicit authorization to expose seeded synthetic accounts;
- `ACME_EMAIL`: operational address for certificate notices;
- `POSTGRES_PASSWORD`: database owner credential;
- `APP_DATABASE_PASSWORD`: least-privileged application role credential;
- `INTERNAL_WORKER_TOKEN`: independent random worker credential of at least 32 bytes.

Compose environment variables are an interim local-server mechanism. Migration to Docker secrets or another secret manager remains an operations hardening item.

## Validation commands

Validate the rendered stack before every release:

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

Once the sandbox release gate is cleared, start with:

```sh
docker compose \
  --env-file infra/docker/.env.production \
  -f infra/docker/docker-compose.production.yml \
  up -d
```

Then verify container health, migration completion, HTTPS redirect, certificate chain, security headers, demo login, denied role actions, synthetic upload/download scanning, API-key/share-link revocation, and audit creation.

## Reset and recovery

Application state is deliberately disposable and must not be presented as backed up. Restarting the API resets seeded state and removes demo activity, limiting persistence of abuse. PostgreSQL migration data and Caddy state use volumes, but the public UI currently exercises the in-memory adapters. Never upload data that requires recovery.

## Rollback

Application images must be tagged immutably for releases. Database migrations must be reviewed for backward compatibility before deployment. Rollback means restoring the previous image tag; if a migration is destructive, restore the tested pre-deploy database backup instead of attempting an ad-hoc downgrade.
