#!/bin/bash

# 해당 파일은 어플리케이션 전체 환경을 중지할 때 사용합니다.
# jepark 2026-03-04

echo "Stopping WISE-Office application..."

docker compose \
  --env-file ./.env.dev \
  down

echo "WISE-Office application stopped"