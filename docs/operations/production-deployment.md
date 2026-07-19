# Production deployment runbook

## Status

Target URL: `https://vault.norvix.no`

This deployment is a controlled, ephemeral portfolio sandbox, not a production SaaS service. `NODE_ENV=production` enables runtime hardening while the separate `DEMO_MODE=true` switch explicitly enables seeded demo login. The sandbox accepts synthetic data only, runs one API instance, keeps application state in memory, and resets on restart.

## Architecture

Internet traffic reaches only Caddy on TCP 80/443 and UDP 443. Caddy obtains and renews the TLS certificate, routes `/api/*` to Fastify, and routes all other requests to Next.js. Web and API share one browser origin, reducing CORS and cookie complexity. PostgreSQL is attached only to an internal Docker network and has no host port.

The standalone production stack is defined in `infra/docker/docker-compose.production.yml`. The actual Norvix home server already runs a shared Caddy edge, so it uses `infra/docker/docker-compose.home-server.yml` and the site fragment `infra/caddy/vault.norvix.no.caddy` instead. Never start the standalone Caddy stack on that server because ports 80/443 are already owned by the shared proxy.

The standalone stack contains:

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

## Norvix home-server integration

Detected server architecture:

- Ubuntu 24.04 LTS at LAN address `192.168.50.23`;
- shared Caddy container is the only public listener on 80/443;
- external Docker network `proxy` connects Caddy to applications;
- application folders live below `/srv/projects`;
- a self-hosted GitHub Actions runner is installed;
- SSH is key-only and restricted to the LAN.

TrustVault uses the aliases `trustvault-web` and `trustvault-api` on the external `proxy` network. PostgreSQL and the migration job remain only on the internal `data` network. The home-server Compose file publishes no host ports.

Fastify trusts exactly one proxy hop, which is Caddy in this topology. If Cloudflare proxying is enabled, Caddy must also be configured with Cloudflare's published address ranges as trusted proxies (with strict right-to-left parsing), and direct origin access must be restricted. Otherwise rate limiting and audit hashes identify the Cloudflare edge rather than the end user. DNS-only operation avoids this additional proxy hop and is the initial deployment recommendation.

Before the first deploy, create the server secret file manually:

```sh
mkdir -p /srv/projects/trustvault
cp infra/docker/.env.production.example /srv/projects/trustvault/.env
chmod 600 /srv/projects/trustvault/.env
nano /srv/projects/trustvault/.env
```

Also create a Cloudflare `A` record for `vault.norvix.no` pointing to the current public IP, initially set to **DNS only**. Do not add `AAAA` unless IPv6 routing and firewall rules are verified.

The workflow `.github/workflows/deploy-home-server.yml` is manual-only. It refuses non-`main` refs, preserves the server `.env`, validates the external `proxy` network, deploys the application, installs the Caddy site fragment, validates the full Caddy configuration, reloads Caddy, and checks API health from the proxy network.

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

For a standalone host, once the sandbox release gate is cleared, start with:

```sh
docker compose \
  --env-file infra/docker/.env.production \
  -f infra/docker/docker-compose.production.yml \
  up -d
```

Then verify container health, migration completion, HTTPS redirect, certificate chain, security headers, demo login, denied role actions, synthetic upload/download scanning, API-key/share-link revocation, and audit creation.

On the Norvix home server, use the manual **Deploy Home Server Sandbox** GitHub Actions workflow after merging to `main`; do not run the standalone Compose command above.

## Reset and recovery

Application state is deliberately disposable and must not be presented as backed up. Restarting the API resets seeded state and removes demo activity, limiting persistence of abuse. PostgreSQL migration data and Caddy state use volumes, but the public UI currently exercises the in-memory adapters. Never upload data that requires recovery.

## Rollback

Application images must be tagged immutably for releases. Database migrations must be reviewed for backward compatibility before deployment. Rollback means restoring the previous image tag; if a migration is destructive, restore the tested pre-deploy database backup instead of attempting an ad-hoc downgrade.
