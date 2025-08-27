# WISE-Office Server

연구소 연구기획팀의 백오피스 서버 레포지토리입니다.

## 🛠️ 기술 스택 (Tech Stack)

- **Language**: `Java 17`
- **Framework**: `Spring Boot 3.3.10`
- **Database**: `PostgreSQL`
- **Data Access**: `Spring Data JPA`
- **Security**: `Spring Security`, `JWT (JSON Web Token)`, `Google OAuth2`
- **API Documentation**: `Swagger (Springdoc OpenAPI)`
- **Build Tool**: `Gradle`
- **Utilities**: `Lombok`

## 🏛️ 서버 구조 (Server Architecture)

```
wise-office-server/
└── src/
    └── main/
        └── java/
            └── kr/co/wise/office/
                ├── api/               # 1. API 계층 (Presentation Layer)
                ├── application/       # 2. 애플리케이션 계층 (Application Layer)
                ├── domain/            # 3. 도메인 계층 (Domain Layer)
                ├── config/            # 4. 인프라 계층 (Infrastructure Layer)
                ├── security/
                ├── exception/
                └── util/
    └── test/
        └── java/
            └── kr/co/wise/office
                ├── application # 애플케이션 계층 테스트 코드 
                ├── domain # 도메인 계층 테스트 코드
```

### 1. API 계층 (`api`)
- 클라이언트의 HTTP 요청을 받아들이는 엔드포인트(Controller)가 위치합니다.
- 요청 데이터를 DTO(Data Transfer Object)로 변환하여 애플리케이션 계층으로 전달하고, 처리 결과를 HTTP 응답으로 반환합니다.

### 2. 애플리케이션 계층 (`application`)
- 권한 확인과 같은 검증을 수행하고 도메인 계층의 서비스들을 조합하여 전체적인 흐름을 관리합니다.

### 3. 도메인 계층 (`domain`)
- 애플리케이션의 핵심 비즈니스 로직이 구현되는 곳입니다.
- 각 도메인은 기능별로 패키지가 나뉘어 있으며, 공통적으로 `dto`, `entity`, `repository`, `service` 하위 패키지를 가집니다.

- **주요 도메인 패키지:**
  - **`attendant`**: 프로젝트 또는 특정 항목의 참석자/담당자 정보를 관리합니다.
  - **`comment`**: 댓글 관련 기능을 담당합니다.
  - **`Log`**: 시스템 또는 사용자 활동 로그를 관리합니다.
  - **`member`**: 사용자(회원) 정보 및 권한을 관리합니다.
  - **`Project`**: 프로젝트의 생성, 조회, 수정 등 핵심 정보를 관리합니다.

- **공통 하위 패키지 구조**:
  - **`entity`**: JPA를 통해 데이터베이스 테이블과 매핑되는 객체입니다.
  - **`repository`**: JPA 기반 데이터베이스에 접근하는 패키지입니다.
  - **`service`**: 해당 도메인의 핵심 비즈니스 로직을 수행하는 서비스입니다.
  - **`dto`**: 계층 간 데이터 전송에 사용되는 객체입니다.

### 4. 인프라 계층 (`config`, `security`, `util`, `exception`)
- 애플리케이션의 주요 기능들을 지원하는 기술들을 설정하고 관리합니다.
- **`config`**: `Spring Security`, `JPA`, `Swagger` 등  주요 프레임워크의 설정을 담당합니다.
- **`security`**: `JWT Filter`, `OAuth2` 핸들러 등 보안 관련 로직을 포함합니다.
- **`util`**: `JWTUtil`과 같이 프로젝트 전반에서 사용되는 유틸리티 클래스를 포함합니다.
- **`exception`**: 전역 예외 처리(`GlobalExceptionHandler`) 및 커스텀 예외를 처리합니다.

## 🚀 실행 방법 (Getting Started)

프로젝트 루트 디렉터리에서 다음 스크립트를 실행하여 서버를 시작하고 중지할 수 있습니다.

- 서버는 데이터베이스 및 자바기반 스프링부트 애플리케이션이 실행됩니다.
- 실행시 Application-docker.yml 파일이 main/resources에 존재해야 합니다.

# **서버 시작**:
  ```shell 
  # 현재 디렉토리 (server) 기준
  ../wise-office-infra/dev-env.bat
  ```

# **서버 중지**:
  ```shell
  # 현재 디렉토리 (server) 기준
  ../wise-office-infra/dev-env-stop.bat
  ```