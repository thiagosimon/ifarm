#!/usr/bin/env bash
set -euo pipefail

# iFarm Platform — Quick Health Check
# Checks all running services and infrastructure

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "============================================"
echo "  iFarm Platform — Health Check"
echo "============================================"
echo ""

echo "Infrastructure:"
for svc in mongodb postgres redis rabbitmq keycloak prometheus grafana loki; do
  PORT=""
  case $svc in
    mongodb)    PORT=27017 ;;
    postgres)   PORT=5432 ;;
    redis)      PORT=6379 ;;
    rabbitmq)   PORT=5672 ;;
    keycloak)   PORT=8080 ;;
    prometheus) PORT=9090 ;;
    grafana)    PORT=3200 ;;
    loki)       PORT=3100 ;;
  esac

  if nc -z localhost "$PORT" 2>/dev/null; then
    echo -e "  ${GREEN}●${NC} $svc (:$PORT)"
  else
    echo -e "  ${RED}●${NC} $svc (:$PORT) — not reachable"
  fi
done

echo ""
echo "Backend Services:"

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

  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$SVC_PORT/v1/health" 2>/dev/null || echo "000")
  if [ "$HTTP_STATUS" = "000" ]; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$SVC_PORT/health" 2>/dev/null || echo "000")
  fi

  if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "  ${GREEN}●${NC} $SVC_NAME (:$SVC_PORT) — healthy"
  elif [ "$HTTP_STATUS" = "503" ]; then
    echo -e "  ${YELLOW}●${NC} $SVC_NAME (:$SVC_PORT) — degraded"
  elif [ "$HTTP_STATUS" = "000" ]; then
    echo -e "  ${RED}●${NC} $SVC_NAME (:$SVC_PORT) — not running"
  else
    echo -e "  ${YELLOW}●${NC} $SVC_NAME (:$SVC_PORT) — status $HTTP_STATUS"
  fi
done

echo ""
echo "Frontend Apps:"
for entry in "web-retailer:4000" "web-admin:4001"; do
  APP_NAME="${entry%%:*}"
  APP_PORT="${entry##*:}"

  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$APP_PORT" 2>/dev/null || echo "000")
  if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo -e "  ${GREEN}●${NC} $APP_NAME (:$APP_PORT) — running"
  elif [ "$HTTP_STATUS" = "000" ]; then
    echo -e "  ${RED}●${NC} $APP_NAME (:$APP_PORT) — not running"
  else
    echo -e "  ${YELLOW}●${NC} $APP_NAME (:$APP_PORT) — status $HTTP_STATUS"
  fi
done

echo ""
