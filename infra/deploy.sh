#!/usr/bin/env bash
# deploy.sh — Pull latest images and restart services
# Usage: ./deploy.sh <env> [service]
# Example: ./deploy.sh dev api
#          ./deploy.sh prd

set -euo pipefail

ENV="${1:?Usage: $0 <dev|prd> [service]}"
SERVICE="${2:-}"
BASE_DIR="/opt/fit/${ENV}"

if [[ ! -d "$BASE_DIR" ]]; then
  echo "ERROR: Directory $BASE_DIR does not exist"
  exit 1
fi

cd "$BASE_DIR"

if [[ -n "$SERVICE" ]]; then
  echo "==> Deploying service: $SERVICE (env: $ENV)"
  docker compose pull "$SERVICE"
  docker compose up -d --no-deps "$SERVICE"
else
  echo "==> Deploying all services (env: $ENV)"
  docker compose pull
  docker compose up -d
fi

echo "==> Deployment complete"
docker compose ps
