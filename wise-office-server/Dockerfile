# 빌드 stage => 소스 빌드
FROM eclipse-temurin:17-jdk as builder

WORKDIR /backoffice

COPY . .

RUN ./gradlew dependencies

RUN ./gradlew build -x test

# 실행 스테이지
FROM eclipse-temurin:17-jre

WORKDIR /backoffice

COPY --from=builder /backoffice/build/libs/*.jar app.jar

# 컨테이너가 시작될 때 실행할 명령어
ENTRYPOINT ["java", "-jar", "app.jar"]