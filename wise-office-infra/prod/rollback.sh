# 배포 버전에 문제가 발생했을 경우 Rollback 하는 스크립트
#!/bin/bash

COMPOSE_COMMAND="docker compose -f docker-compose.yml -p wise-server --env-file=./.env.prod"
NGINX_CONF_DIR="./nginx/conf.d"
NGINX_TEMPLATE_DIR="./nginx/template"

echo "### Rolling back to the previous version... ###"

# check current running program
if grep -q "application_blue" ${NGINX_CONF_DIR}/upstream.conf; then
    # Rollback to Green
    ROLLBACK_BACKEND="application"
    ROLLBACK_FRONT="frontend"
    ROLLBACK_CONF="green-upstream.conf"
    STOP_BACKEND="application_blue"
    STOP_FRONT="frontend_blue"
else
    # Rollback to blue
    ROLLBACK_BACKEND="application_blue"
    ROLLBACK_FRONT="frontend_blue"
    ROLLBACK_CONF="blue-upstream.conf"
    STOP_BACKEND="application"
    STOP_FRONT="frontend"
fi

echo "### Starting previous version: ${ROLLBACK_FRONT} & ${ROLLBACK_BACKEND} ###"
$COMPOSE_COMMAND start ${ROLLBACK_FRONT} ${ROLLBACK_BACKEND}

echo "### Switching Nginx traffic back to ${ROLLBACK_FRONT} & ${ROLLBACK_BACKEND} ###"
cp "${NGINX_TEMPLATE_DIR}/${ROLLBACK_CONF}" "${NGINX_CONF_DIR}/upstream.conf"
$COMPOSE_COMMAND exec nginx nginx -s reload

echo "### Stopping problematic version: ${STOP_FRONT} & ${STOP_BACKEND} ###"
$COMPOSE_COMMAND stop ${STOP_FRONT} ${STOP_BACKEND}

echo "### Rollback complete! ###"