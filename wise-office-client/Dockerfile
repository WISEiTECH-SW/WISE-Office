# Dockerfile

# 1. Builder Stage: 의존성 설치 및 프로젝트 빌드
FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

RUN echo "NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}"

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# --------------------------------------------------

# 2. Runner Stage: 실제 애플리케이션 실행
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

ENV NODE_ENV=production

# 애플리케이션 실행
CMD ["node", "server.js"]
