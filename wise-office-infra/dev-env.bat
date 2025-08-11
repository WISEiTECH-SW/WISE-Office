@echo off

docker-compose --env-file=./.env.dev up -d

echo "Backend server initialization complete"
echo "You can access the server at: http://localhost:8080/"
echo "To stop the server, run 'docker-compose down' in your terminal."