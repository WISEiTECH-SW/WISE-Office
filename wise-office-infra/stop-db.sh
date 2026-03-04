#!/bin/bash

# 해당 파일은 도커 환경에 데이터베이스만 정지시키고 싶은 경우 사용하는 파일입니다.
# jepark 2026-03-04

echo "Stopping PostgreSQL Database..."

docker compose \
  -f docker-compose.db.yml \
  --env-file ./.env.dev \
  down

echo "Postgre Database stopped"