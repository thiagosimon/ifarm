#!/usr/bin/env bash
set -euo pipefail

# iFarm Platform — Start All Services
# Starts all 12 services and 2 frontends in parallel

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$ROOT_DIR/.logs"

mkdir -p "$LOG_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_ok()   { echo -e "${GREEN}[OK]${NC} $1"; }

cd "$ROOT_DIR"

echo ""
echo "============================================"
echo "  iFarm Platform — Starting All Services"
echo "============================================"
echo ""

# Check infrastructure
log_info "Checking infrastructure..."
if ! docker compose ps --format json mongodb 2>/dev/null | grep -q "running"; then
  log_info "Starting infrastructure..."
  docker compose up -d
  sleep 10
fi
log_ok "Infrastructure running"

echo ""

# Start all NestJS services
SERVICES=(
  "api-gateway:3000"
  "identity-service:3001"
  "auth-service:3002"
  "catalog-service:3003"
  "quotation-service:3004"
  "matching-service:3005"
  "order-service:3006"
  "payment-service:3007"
  "commission-service:3008"
  "tax-service:3009"
  "notification-service:3010"
  "review-service:3011"
)

PIDS=()

for entry in "${SERVICES[@]}"; do
  SVC_NAME="${entry%%:*}"
  SVC_PORT="${entry##*:}"

  log_info "Starting $SVC_NAME on port $SVC_PORT..."
  cd "$ROOT_DIR/services/$SVC_NAME"
  npx nest start --watch > "$LOG_DIR/$SVC_NAME.log" 2>&1 &
  PIDS+=("$!:$SVC_NAME")
  cd "$ROOT_DIR"
done

# Start frontends
log_info "Starting web-retailer on port 4000..."
cd "$ROOT_DIR/apps/web-retailer"
npx next dev -p 4000 > "$LOG_DIR/web-retailer.log" 2>&1 &
PIDS+=("$!:web-retailer")
cd "$ROOT_DIR"

log_info "Starting web-admin on port 4001..."
cd "$ROOT_DIR/apps/web-admin"
npx next dev -p 4001 > "$LOG_DIR/web-admin.log" 2>&1 &
PIDS+=("$!:web-admin")
cd "$ROOT_DIR"

echo ""
log_ok "All services started!"
echo ""

# Wait for services to be ready
log_info "Waiting 10s for services to initialize..."
sleep 10

echo ""
echo "============================================"
echo "  Service Status"
echo "============================================"
echo ""

for entry in "${SERVICES[@]}"; do
  SVC_NAME="${entry%%:*}"
  SVC_PORT="${entry##*:}"

  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$SVC_PORT/v1/health" 2>/dev/null || echo "000")
  if [ "$HTTP_STATUS" = "000" ]; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$SVC_PORT/health" 2>/dev/null || echo "000")
  fi

  if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "  ${GREEN}●${NC} $SVC_NAME (:$SVC_PORT) — healthy"
  elif [ "$HTTP_STATUS" = "503" ]; then
    echo -e "  ${YELLOW}●${NC} $SVC_NAME (:$SVC_PORT) — degraded (503)"
  else
    echo -e "  ${RED}●${NC} $SVC_NAME (:$SVC_PORT) — not responding ($HTTP_STATUS)"
  fi
done

for APP in "web-retailer:4000" "web-admin:4001"; do
  APP_NAME="${APP%%:*}"
  APP_PORT="${APP##*:}"
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$APP_PORT" 2>/dev/null || echo "000")
  if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo -e "  ${GREEN}●${NC} $APP_NAME (:$APP_PORT) — running"
  else
    echo -e "  ${YELLOW}●${NC} $APP_NAME (:$APP_PORT) — starting ($HTTP_STATUS)"
  fi
done

echo ""
echo "Logs: $LOG_DIR/"
echo ""
echo "URLs:"
echo "  API Gateway:    http://localhost:3000"
echo "  Web Retailer:   http://localhost:4000"
echo "  Web Admin:      http://localhost:4001"
echo "  Keycloak:       http://localhost:8080"
echo "  RabbitMQ:       http://localhost:15672"
echo "  Prometheus:     http://localhost:9090"
echo "  Grafana:        http://localhost:3200"
echo ""
echo "Press Ctrl+C to stop all services"

# Trap SIGINT/SIGTERM to kill all children
cleanup() {
  echo ""
  log_info "Stopping all services..."
  for pid_entry in "${PIDS[@]}"; do
    PID="${pid_entry%%:*}"
    NAME="${pid_entry##*:}"
    kill "$PID" 2>/dev/null && log_ok "Stopped $NAME" || true
  done
  wait
  log_ok "All services stopped"
}

trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait
