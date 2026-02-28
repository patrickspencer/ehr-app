#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Configurable ports
BACKEND_PORT="${BACKEND_PORT:-8091}"
FRONTEND_PORT="${FRONTEND_PORT:-3001}"

# Start Postgres if not running
if ! docker compose ps --status running 2>/dev/null | grep -q postgres; then
  echo "Starting Postgres..."
  docker compose up -d
  sleep 2
fi

# Start backend
echo "Starting backend on :$BACKEND_PORT..."
cd backend
SERVER_PORT=$BACKEND_PORT ./gradlew bootRun --quiet &
BACKEND_PID=$!
./gradlew compileKotlin --continuous --quiet &
COMPILE_PID=$!
cd ..

# Wait for backend to be ready
for i in $(seq 1 30); do
  if curl -s http://localhost:$BACKEND_PORT/api/patients >/dev/null 2>&1; then
    echo "Backend is ready."
    break
  fi
  sleep 2
done

# Start frontend
echo "Starting frontend on :$FRONTEND_PORT..."
cd frontend
NEXT_PUBLIC_API_URL="http://localhost:$BACKEND_PORT" npm run dev -- -p $FRONTEND_PORT &
FRONTEND_PID=$!
cd ..

echo ""
echo "EHR app running:"
echo "  Frontend: http://localhost:$FRONTEND_PORT"
echo "  Backend:  http://localhost:$BACKEND_PORT"
echo ""
echo "Press Ctrl+C to stop."

trap "kill $BACKEND_PID $COMPILE_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
