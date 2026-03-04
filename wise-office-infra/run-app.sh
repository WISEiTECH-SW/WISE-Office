#!/bin/bash

# 해당 파일은 어플리케이션 전체 환경을 구동할 때 사용합니다.
# jepark 2026-03-04

echo "Starting WISE-Office application..."

docker compose \
  --env-file ./.env.dev \
  up --build -d --wait

echo "WISE-Office application initialization complete"
echo "You can access the server at: http://localhost:8080/"