@echo off
REM 해당 파일은 dev-env.bat 실행 이후 서버 전체 환경을 종료할 때 사용합니다.
REM jhryu 2025-08-27

docker-compose -f docker-compose.yml -p wise-server --env-file ./.env.dev down

echo Complete Database ShutDown!