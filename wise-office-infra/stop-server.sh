#!/bin/bash

# 해당 파일은 서버 환경을 중지할 때 사용합니다.
# jepark 2026-03-04

echo "Stopping WISE-Office server..."

docker compose \
  -f docker-compose.server.yml \
  --env-file ./.env.dev \
  down

echo "WISE-Office server stopped"