# 빌드 stage => 소스 빌드
FROM eclipse-temurin:17-jdk as builder

WORKDIR /backoffice

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

RUN ./gradlew dependencies --no-daemon

COPY src src

RUN ./gradlew build -x test --no-daemon

# 실행 스테이지
FROM eclipse-temurin:17-jre

WORKDIR /backoffice

RUN mkdir images

COPY --from=builder /backoffice/build/libs/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=docker

# 컨테이너가 시작될 때 실행할 명령어
ENTRYPOINT ["java", "-jar", "-Duser.timezone=Asia/Seoul", "app.jar"]