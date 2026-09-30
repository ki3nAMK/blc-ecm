#!/usr/bin/env bash
# Starts the full blc-ecm stack: Docker (Mongo+Redis), Hardhat local chain,
# contract deploy + product listing, backend API, and frontend.
# Run from Git Bash: ./start-all.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$ROOT_DIR/ecommerce-contract-api"
CONTRACT_DIR="$ROOT_DIR/ecommerce-smart-contract"
WEB_DIR="$ROOT_DIR/ecommerce-contract"
LOG_DIR="$ROOT_DIR/.run-logs"
mkdir -p "$LOG_DIR"

port_in_use() {
  (echo > "/dev/tcp/127.0.0.1/$1") >/dev/null 2>&1
}

echo "==> Checking Docker..."
if ! docker info >/dev/null 2>&1; then
  echo "    Starting Docker Desktop (this can take a minute)..."
  "/c/Program Files/Docker/Docker/Docker Desktop.exe" >/dev/null 2>&1 &
  disown
  until docker info >/dev/null 2>&1; do
    sleep 2
  done
fi
echo "    Docker is ready."

echo "==> Ensuring pizza_network exists..."
docker network ls --format '{{.Name}}' | grep -qx 'pizza_network' || docker network create pizza_network >/dev/null

echo "==> Starting MongoDB + Redis..."
(cd "$API_DIR" && docker compose up -d)

echo "==> Waiting for MongoDB to become primary..."
until [ "$(docker exec mongodb mongosh --quiet --eval 'rs.status().myState' 2>/dev/null)" = "1" ]; do
  sleep 2
done
echo "    MongoDB is primary."

STARTED_CHAIN=0
if port_in_use 8545; then
  echo "==> Hardhat node already running on :8545, skipping."
else
  echo "==> Starting Hardhat local node..."
  (cd "$CONTRACT_DIR" && nohup npx hardhat node > "$LOG_DIR/hardhat-node.log" 2>&1 &)
  until grep -q "Started HTTP and WebSocket JSON-RPC server" "$LOG_DIR/hardhat-node.log" 2>/dev/null; do
    sleep 1
  done
  echo "    Hardhat node ready on http://127.0.0.1:8545"
  STARTED_CHAIN=1
fi

if [ "$STARTED_CHAIN" = "1" ]; then
  echo "==> Deploying contracts + listing products (fresh chain)..."
  (cd "$CONTRACT_DIR" && npx hardhat run scripts/deploy.js --network localhost | tee "$LOG_DIR/deploy.log")
else
  echo "==> Chain was already running, skipping deploy (assuming contracts are already listed)."
fi

if port_in_use 3000; then
  echo "==> Backend already running on :3000, skipping."
else
  echo "==> Starting backend API..."
  (cd "$API_DIR" && nohup yarn start:dev > "$LOG_DIR/backend-dev.log" 2>&1 &)
  until grep -q "Nest application successfully started" "$LOG_DIR/backend-dev.log" 2>/dev/null; do
    sleep 1
  done
  echo "    Backend ready on http://localhost:3000"
fi

if port_in_use 8081; then
  echo "==> Frontend already running on :8081, skipping."
else
  echo "==> Starting frontend..."
  (cd "$WEB_DIR" && nohup yarn dev > "$LOG_DIR/frontend-dev.log" 2>&1 &)
  until grep -q "ready in" "$LOG_DIR/frontend-dev.log" 2>/dev/null; do
    sleep 1
  done
fi

FRONTEND_URL="$(grep -m1 -oE 'http://localhost:[0-9]+' "$LOG_DIR/frontend-dev.log" 2>/dev/null || echo 'http://localhost:8081')"

cat <<EOF

All services are up:
  Frontend : $FRONTEND_URL
  Backend  : http://localhost:3000
  Hardhat  : http://127.0.0.1:8545
  Mongo    : mongodb://localhost:27017
  Redis    : localhost:6379

Logs: $LOG_DIR
(Services keep running in the background after this script exits.)
EOF
