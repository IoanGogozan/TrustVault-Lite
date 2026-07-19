#!/usr/bin/env bash
set -euo pipefail

readonly APP_DIR=/srv/projects/trustvault
readonly APP_COMPOSE="$APP_DIR/infra/docker/docker-compose.home-server.yml"
readonly APP_ENV="$APP_DIR/.env"
readonly PROXY_COMPOSE=/srv/proxy/compose.yml

# Recreating the API deletes all in-memory sandbox activity and the replaced
# container's request/security log at least once every 24 hours.
/usr/bin/docker compose \
  --env-file "$APP_ENV" \
  -f "$APP_COMPOSE" \
  up -d --force-recreate --no-deps api

# Caddy's file logger rotates on size. This explicit daily move and reload also
# guarantees a time boundary for low-traffic logs.
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
/usr/bin/docker exec caddy sh -eu -c '
  log=/data/logs/trustvault-access.log
  if [ -f "$log" ]; then
    mv "$log" "/data/logs/trustvault-access-'"$timestamp"'.log"
  fi
'
/usr/bin/docker compose -f "$PROXY_COMPOSE" exec -T caddy \
  caddy reload --config /etc/caddy/Caddyfile

# With an exact daily schedule, -mtime +6 removes an archive as it reaches its
# seventh 24-hour period. Targets are constrained to the dedicated log folder.
/usr/bin/docker exec caddy find /data/logs \
  -type f -name 'trustvault-access-*.log' -mtime +6 -delete
