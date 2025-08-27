@echo off

REM 해당 파일은 db-run.bat 을 통해 데이터베이스만 킨 경우 종료하는 파일입니다.
REM jhryu 2025-08-27

docker-compose -f docker-compose.db.yml -p wise-database --env-file ./.env.dev down

echo Complete Database ShutDown!