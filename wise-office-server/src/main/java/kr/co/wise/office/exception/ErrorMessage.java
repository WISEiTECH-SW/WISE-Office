package kr.co.wise.office.exception;

import org.springframework.http.HttpStatus;

public enum ErrorMessage {

    NOT_FOUND_LOG(HttpStatus.BAD_REQUEST, "존재하지 않는 로그입니다."),
    NOT_FOUND_PROJECT(HttpStatus.BAD_REQUEST, "존재하지 않는 프로젝트입니다."),
    NOT_FOUND_MEMBER(HttpStatus.BAD_REQUEST, "존재하지 않는 회원입니다"),
    NOT_FOUND_ATTENDANT(HttpStatus.BAD_REQUEST, "참여하지 않은 멤버입니다."),
    NOT_FOUND_COMMENT(HttpStatus.BAD_REQUEST, "존재하지 않는 댓글입니다."),

    REJECT_MODIFYING_PROJECT(HttpStatus.UNAUTHORIZED, "프로젝트 수정/삭제 권한이 없습니다."),
    REJECT_MODIFYING_LOG(HttpStatus.UNAUTHORIZED, "로그 수정/삭제 권한이 없습니다."),
    REJECT_IMAGE_FORMAT(HttpStatus.BAD_REQUEST, "불가능한 프로필 이미지 형식입니다."),
    REJECT_MODIFYING_COMMENT(HttpStatus.UNAUTHORIZED, "댓글 수정/삭제 권한이 없습니다."),

    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 에러입니다."),
    INVALID_MEMBER(HttpStatus.UNAUTHORIZED, "아이디 혹은 비밀번호를 잘못 입력했습니다."),

    FORBIDDEN_SIGNUP(HttpStatus.BAD_REQUEST, "불가능한 이메일입니다. 회사 도메인의 이메일을 사용해주세요."),
    AlREADY_SIGNUP_EMAIL(HttpStatus.BAD_REQUEST, "이미 가입한 이메일입니다. 다른 이메일을 이용하세요."),

    REPEATED_CALL(HttpStatus.BAD_REQUEST, "잠시 뒤에 다시 요청해 주세요.");

    private HttpStatus status;
    private String message;

    ErrorMessage(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

}
