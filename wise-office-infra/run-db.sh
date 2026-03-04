#!/bin/bash

# 해당 파일은 데이터베이스만 도커 환경에 구동시키고 싶은 경우 사용하는 파일입니다.
# jepark 2026-03-04

echo "Starting PostgreSQL Database..."

docker compose \
  -f docker-compose.db.yml \
  --env-file ./.env.dev \
  up -d --wait

echo "Postgre Database initialization complete"