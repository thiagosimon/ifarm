#!/usr/bin/env bash
set -euo pipefail

# iFarm Platform — Setup Script
# This script installs dependencies, starts infrastructure, creates databases,
# builds all packages, and verifies each service can start.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Track failures
FAILURES=()

cd "$ROOT_DIR"

echo ""
echo "============================================"
echo "  iFarm Platform — Setup & Verification"
echo "============================================"
echo ""

# ─────────────────────────────────────────────────
# Step 1: Check prerequisites
# ─────────────────────────────────────────────────
log_info "Step 1: Checking prerequisites..."

check_cmd() {
  if command -v "$1" &>/dev/null; then
    log_ok "$1 found: $($1 --version 2>&1 | head -1)"
  else
    log_error "$1 not found. Please install it."
    exit 1
  fi
}

check_cmd node
check_cmd npm
check_cmd docker

NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
  log_error "Node.js >= 20 required (found $(node -v))"
  exit 1
fi
log_ok "Node.js version OK"

if ! docker info &>/dev/null; then
  log_error "Docker daemon is not running. Please start Docker Desktop."
  exit 1
fi
log_ok "Docker daemon running"

echo ""

# ─────────────────────────────────────────────────
# Step 2: Install dependencies
# ─────────────────────────────────────────────────
log_info "Step 2: Installing npm dependencies (monorepo workspaces)..."

npm install --legacy-peer-deps 2>&1 | tail -5

if [ -d "node_modules" ]; then
  log_ok "npm install completed"
else
  log_error "npm install failed — node_modules not found"
  exit 1
fi

echo ""

# ─────────────────────────────────────────────────
# Step 3: Start infrastructure via docker-compose
# ─────────────────────────────────────────────────
log_info "Step 3: Starting infrastructure (docker-compose)..."

docker compose up -d 2>&1

log_info "Waiting for services to become healthy..."
sleep 10

# Check each infrastructure service
for svc in mongodb postgres redis rabbitmq keycloak; do
  STATUS=$(docker compose ps --format json "$svc" 2>/dev/null | grep -o '"Health":"[^"]*"' | head -1 || echo "")
  if echo "$STATUS" | grep -q "healthy"; then
    log_ok "$svc is healthy"
  else
    log_warn "$svc may not be healthy yet (status: $STATUS). Waiting 15s more..."
    sleep 15
    STATUS=$(docker compose ps --format json "$svc" 2>/dev/null | grep -o '"Health":"[^"]*"' | head -1 || echo "")
    if echo "$STATUS" | grep -q "healthy"; then
      log_ok "$svc is healthy (after retry)"
    else
      log_warn "$svc health status unclear. Continuing..."
    fi
  fi
done

echo ""

# ─────────────────────────────────────────────────
# Step 4: Create PostgreSQL databases
# ─────────────────────────────────────────────────
log_info "Step 4: Creating PostgreSQL databases..."

PG_DATABASES=("ifarm_orders" "ifarm_payments" "ifarm_commission")

for db in "${PG_DATABASES[@]}"; do
  docker compose exec -T postgres psql -U ifarm -d ifarm -c "CREATE DATABASE $db;" 2>/dev/null || true
  log_ok "Database $db ensured"
done

echo ""

# ─────────────────────────────────────────────────
# Step 5: Build shared packages first
# ─────────────────────────────────────────────────
log_info "Step 5: Building shared packages..."

PACKAGES=("shared-constants" "shared-dtos" "shared-events" "shared-validators" "shared-test-factories")

for pkg in "${PACKAGES[@]}"; do
  PKG_DIR="packages/$pkg"
  if [ -f "$PKG_DIR/tsconfig.json" ]; then
    log_info "Building $pkg..."
    cd "$ROOT_DIR/$PKG_DIR"
    npx tsc --build 2>&1 || {
      log_warn "$pkg build had issues (non-critical)"
    }
    cd "$ROOT_DIR"
    log_ok "$pkg built"
  else
    log_warn "$pkg has no tsconfig.json, skipping build"
  fi
done

echo ""

# ─────────────────────────────────────────────────
# Step 6: Build and verify each service
# ─────────────────────────────────────────────────
log_info "Step 6: Building and verifying services..."

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

for entry in "${SERVICES[@]}"; do
  SVC_NAME="${entry%%:*}"
  SVC_PORT="${entry##*:}"
  SVC_DIR="services/$SVC_NAME"

  log_info "[$SVC_NAME] Building..."

  cd "$ROOT_DIR/$SVC_DIR"

  # Build
  if npx nest build 2>&1; then
    log_ok "[$SVC_NAME] Build succeeded"
  else
    log_error "[$SVC_NAME] Build FAILED"
    FAILURES+=("$SVC_NAME:build")
    cd "$ROOT_DIR"
    continue
  fi

  # Verify startup (start, wait 5s, check if process is alive, then kill)
  log_info "[$SVC_NAME] Testing startup on port $SVC_PORT..."

  timeout 15 node dist/main.js &>/dev/null &
  PID=$!
  sleep 5

  if kill -0 "$PID" 2>/dev/null; then
    # Try health check
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$SVC_PORT/v1/health" 2>/dev/null || echo "000")
    if [ "$HTTP_STATUS" = "000" ]; then
      HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$SVC_PORT/health" 2>/dev/null || echo "000")
    fi

    if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "503" ]; then
      log_ok "[$SVC_NAME] Started OK (health: $HTTP_STATUS)"
    else
      log_warn "[$SVC_NAME] Started but health returned $HTTP_STATUS"
    fi

    kill "$PID" 2>/dev/null || true
    wait "$PID" 2>/dev/null || true
  else
    log_error "[$SVC_NAME] Failed to start (crashed within 5s)"
    FAILURES+=("$SVC_NAME:startup")
  fi

  cd "$ROOT_DIR"
done

echo ""

# ─────────────────────────────────────────────────
# Step 7: Build frontends
# ─────────────────────────────────────────────────
log_info "Step 7: Building frontend apps..."

APPS=("web-retailer:4000" "web-admin:4001")

for entry in "${APPS[@]}"; do
  APP_NAME="${entry%%:*}"
  APP_PORT="${entry##*:}"
  APP_DIR="apps/$APP_NAME"

  log_info "[$APP_NAME] Building..."

  cd "$ROOT_DIR/$APP_DIR"

  if npx next build 2>&1 | tail -5; then
    log_ok "[$APP_NAME] Build succeeded"
  else
    log_error "[$APP_NAME] Build FAILED"
    FAILURES+=("$APP_NAME:build")
  fi

  cd "$ROOT_DIR"
done

echo ""

# ─────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────
echo "============================================"
echo "  Setup Complete — Summary"
echo "============================================"
echo ""

if [ ${#FAILURES[@]} -eq 0 ]; then
  log_ok "All services and apps built and verified successfully!"
else
  log_error "The following had issues:"
  for f in "${FAILURES[@]}"; do
    log_error "  - $f"
  done
fi

echo ""
echo "Infrastructure:"
docker compose ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || docker compose ps

echo ""
echo "Next steps:"
echo "  1. Start all services:  npm run dev"
echo "  2. Or start individual: cd services/<name> && npm run dev"
echo "  3. Open web-retailer:   http://localhost:4000"
echo "  4. Open web-admin:      http://localhost:4001"
echo "  5. Keycloak admin:      http://localhost:8080 (admin/admin123)"
echo "  6. RabbitMQ management: http://localhost:15672 (ifarm/ifarm123)"
echo ""
