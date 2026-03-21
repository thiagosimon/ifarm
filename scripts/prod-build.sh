#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# prod-build.sh — Builda todas as imagens Docker dos microserviços localmente
# Uso: ./scripts/prod-build.sh [service_name]
# Exemplo: ./scripts/prod-build.sh api-gateway   (builda só o gateway)
#          ./scripts/prod-build.sh                (builda todos)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SERVICES=(
  api-gateway
  identity-service
  auth-service
  catalog-service
  quotation-service
  matching-service
  order-service
  payment-service
  commission-service
  tax-service
  notification-service
  review-service
)

build_service() {
  local name="$1"
  local dir="$ROOT/services/$name"

  if [ ! -f "$dir/Dockerfile" ]; then
    echo "⚠️  Sem Dockerfile: $name — pulando"
    return
  fi

  echo ""
  echo "▶  Buildando ifarm/$name:latest ..."
  docker build \
    --platform linux/amd64 \
    -t "ifarm/$name:latest" \
    "$dir"
  echo "✅ ifarm/$name:latest pronto"
}

# Build de um serviço específico ou todos
if [ -n "${1:-}" ]; then
  build_service "$1"
else
  echo "Buildando ${#SERVICES[@]} imagens..."
  for svc in "${SERVICES[@]}"; do
    build_service "$svc"
  done
fi

echo ""
echo "Imagens disponíveis:"
docker images | grep "^ifarm/" | sort
