@echo off
REM 해당 파일은 서버 전체 환경을 구동할 때 사용합니다.
REM jhryu 2025-08-27


docker-compose -f docker-compose.yml -p wise-server --env-file=./.env.dev up --build -d --wait

echo "Backend server initialization complete"
echo "You can access the server at: http://localhost:8080/"
echo "To stop the server, run 'docker-compose down' in your terminal."