@echo off

REM 해당 파일은 데이터베이스만 도커 환경에 구동시키고 싶은 경우 사용하는 파일입니다.
REM jhryu 2025-08-27

docker-compose -p wise-database -f docker-compose.db.yml --env-file=./.env.dev up -d --wait

echo Postgre DataBase initialization complete
echo To stop the server, run 'docker-compose down' in your terminal