#!/bin/bash
# 해당 파일은 Blue/Green 배포 적용 전, 최초로 시작해야 하는 파일입니다.
# jhryu 2025-08-27

docker compose -f docker-compose.yml -p wise-server --env-file=./.env.prod up -d --build nginx database application frontend
