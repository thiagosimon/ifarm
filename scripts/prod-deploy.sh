#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# prod-deploy.sh — Sobe o stack completo de produção no Mac Mini
# Uso: ./scripts/prod-deploy.sh [up|down|restart|status|logs]
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT/infra/docker/docker-compose.prod.yml"
ENV_FILE="$ROOT/infra/docker/.env.prod"
CMD="${1:-up}"

# Verifica pré-requisitos
check_prereqs() {
  if ! command -v docker &>/dev/null; then
    echo "❌ Docker não encontrado. Instale Docker Desktop ou Colima."
    exit 1
  fi

  if ! docker info &>/dev/null; then
    echo "❌ Docker não está rodando. Inicie o Docker Desktop ou Colima."
    exit 1
  fi

  if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Arquivo $ENV_FILE não encontrado."
    echo "   Copie o exemplo e preencha os valores:"
    echo "   cp infra/docker/.env.prod.example infra/docker/.env.prod"
    exit 1
  fi

  # Verifica variáveis críticas
  # shellcheck source=/dev/null
  source "$ENV_FILE"
  local missing=()
  for var in CLOUDFLARE_TUNNEL_TOKEN MONGO_ROOT_PASSWORD POSTGRES_PASSWORD \
             REDIS_PASSWORD RABBITMQ_PASSWORD KEYCLOAK_ADMIN_PASSWORD \
             IDENTITY_ENCRYPTION_KEY; do
    if [ -z "${!var:-}" ]; then
      missing+=("$var")
    fi
  done

  if [ ${#missing[@]} -gt 0 ]; then
    echo "❌ Variáveis obrigatórias não preenchidas em .env.prod:"
    for v in "${missing[@]}"; do echo "   - $v"; done
    exit 1
  fi
}

compose() {
  docker compose \
    -f "$COMPOSE_FILE" \
    --env-file "$ENV_FILE" \
    "$@"
}

case "$CMD" in
  up)
    check_prereqs
    echo "🚀 Subindo stack de produção..."
    echo ""

    # Verifica se as imagens existem, builda se necessário
    MISSING_IMAGES=()
    for svc in api-gateway identity-service auth-service catalog-service \
               quotation-service matching-service order-service payment-service \
               commission-service tax-service notification-service review-service; do
      if ! docker image inspect "ifarm/$svc:latest" &>/dev/null; then
        MISSING_IMAGES+=("$svc")
      fi
    done

    if [ ${#MISSING_IMAGES[@]} -gt 0 ]; then
      echo "⚙️  Imagens não encontradas — buildando: ${MISSING_IMAGES[*]}"
      for svc in "${MISSING_IMAGES[@]}"; do
        "$ROOT/scripts/prod-build.sh" "$svc"
      done
    fi

    # Sobe tudo
    compose up -d --remove-orphans

    echo ""
    echo "✅ Stack subindo. Aguarde os healthchecks (~2 min)..."
    echo ""
    echo "   Acompanhe: ./scripts/prod-deploy.sh status"
    echo "   Logs:      ./scripts/prod-deploy.sh logs"
    ;;

  down)
    echo "⏹  Parando stack..."
    compose down
    ;;

  restart)
    SVC="${2:-}"
    if [ -n "$SVC" ]; then
      echo "🔄 Reiniciando $SVC..."
      compose restart "$SVC"
    else
      echo "🔄 Reiniciando todos os serviços..."
      compose restart
    fi
    ;;

  update)
    # Atualiza um serviço específico sem downtime
    SVC="${2:?'Uso: prod-deploy.sh update <service_name>'}"
    echo "⬆️  Atualizando $SVC (zero downtime)..."
    "$ROOT/scripts/prod-build.sh" "$SVC"
    compose up -d --no-deps --force-recreate "$SVC"
    echo "✅ $SVC atualizado"
    ;;

  status)
    echo "📊 Status dos containers:"
    compose ps
    echo ""
    echo "💾 Uso de recursos:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" \
      $(compose ps -q 2>/dev/null) 2>/dev/null || true
    ;;

  logs)
    SVC="${2:-}"
    if [ -n "$SVC" ]; then
      compose logs -f --tail=100 "$SVC"
    else
      compose logs -f --tail=50
    fi
    ;;

  health)
    echo "🏥 Verificando saúde dos serviços..."
    echo ""
    for container in traefik cloudflared mongodb postgres redis rabbitmq keycloak \
                     api-gateway identity-service auth-service catalog-service \
                     quotation-service matching-service order-service payment-service \
                     commission-service tax-service notification-service review-service; do
      STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "not found")
      RUNNING=$(docker inspect --format='{{.State.Running}}' "$container" 2>/dev/null || echo "false")
      if [ "$RUNNING" = "true" ] && [ "$STATUS" = "healthy" ]; then
        echo "  ✅ $container"
      elif [ "$RUNNING" = "true" ] && [ "$STATUS" = "starting" ]; then
        echo "  ⏳ $container (iniciando...)"
      elif [ "$RUNNING" = "true" ] && [ "$STATUS" = "" ]; then
        echo "  🟡 $container (sem healthcheck)"
      else
        echo "  ❌ $container ($STATUS)"
      fi
    done
    ;;

  *)
    echo "Uso: $0 [up|down|restart [svc]|update <svc>|status|logs [svc]|health]"
    exit 1
    ;;
esac
