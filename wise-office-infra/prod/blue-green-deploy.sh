#!/bin/bash

COMPOSE_COMMAND="docker compose -f docker-compose.yml -p wise-server --env-file=./.env.prod"
NGINX_CONF_DIR="./nginx/conf.d"
NGINX_TEMPLATE_DIR="./nginx/template"

# 1. 현재 활성화된 Version 확인
if grep -q "application_blue" ${NGINX_CONF_DIR}/upstream.conf; then
    CURRENT_BACKEND="application_blue"
    CURRENT_FRONTEND="frontend_blue"
    TARGET_BACKEND="application"
    TARGET_FRONTEND="frontend"
    TARGET_CONF="green-upstream.conf"
else
    CURRENT_BACKEND="application"
    CURRENT_FRONTEND="frontend"
    TARGET_BACKEND="application_blue"
    TARGET_FRONTEND="frontend_blue"
    TARGET_CONF="blue-upstream.conf"
fi

echo "### Current running server is ${CURRENT_FRONTEND} & ${CURRENT_BACKEND} ###"
echo "### Starting ${TARGET_FRONTEND} & ${TARGET_BACKEND}... ###"

# 2. 신규 버전 실행 (빌드 + 기동)
$COMPOSE_COMMAND up -d --build ${TARGET_BACKEND} ${TARGET_FRONTEND}

# 3. Health Check (백엔드와 프론트엔드 모두)
echo "### Waiting for health check... ###"
for i in {1..60}; do
    TARGET_BACKEND_CONTAINER=$(${COMPOSE_COMMAND} ps -q ${TARGET_BACKEND})
    TARGET_FRONTEND_CONTAINER=$(${COMPOSE_COMMAND} ps -q ${TARGET_FRONTEND})

    BACKEND_STATE=$(docker inspect --format='{{.State.Health.Status}}' ${TARGET_BACKEND_CONTAINER} 2>/dev/null | tr -d '\r')
    FRONTEND_STATE=$(docker inspect --format='{{.State.Status}}' ${TARGET_FRONTEND_CONTAINER} 2>/dev/null | tr -d '\r')

    if [[ "$BACKEND_STATE" == "healthy" && "$FRONTEND_STATE" == "running" ]]; then
        echo "### Target group is up and running! ###"
        echo "### Creating new upstream.conf to switch traffic... ###"
        
        # upstream 설정 값 변경
        cp ${NGINX_TEMPLATE_DIR}/${TARGET_CONF} ${NGINX_CONF_DIR}/upstream.conf 

        # Nginx 설정 리로드
        $COMPOSE_COMMAND exec nginx nginx -s reload
        echo "### Traffic switched to ${TARGET_BACKEND} & ${TARGET_FRONTEND} ###"

        # 기존 서버 중지
        echo "### Stopping old group... ###"
        $COMPOSE_COMMAND stop ${CURRENT_BACKEND} ${CURRENT_FRONTEND}
        echo "### Stopped ${CURRENT_BACKEND} & ${CURRENT_FRONTEND} ###"
        exit 0
    fi
    sleep 5
done

echo "### Deployment failed: Health check timed out ###"
$COMPOSE_COMMAND stop ${TARGET_BACKEND} ${TARGET_FRONTEND}
exit 1
