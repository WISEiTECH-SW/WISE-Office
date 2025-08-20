package kr.co.wise.office.exception;

import org.springframework.http.HttpStatus;

public enum ErrorMessage {

    NOT_FOUND_LOG(HttpStatus.BAD_REQUEST, "존재하지 않는 로그입니다."),
    NOT_FOUND_PROJECT(HttpStatus.BAD_REQUEST, "존재하지 않는 프로젝트입니다."),
    NOT_FOUND_MEMBER(HttpStatus.BAD_REQUEST, "존재하지 않는 회원입니다"),
    NOT_FOUND_ATTENDANT(HttpStatus.BAD_REQUEST, "참여하지 않은 멤버입니다."),

    REJECT_MODIFYING_PROJECT(HttpStatus.FORBIDDEN, "프로젝트 수정/삭제 권한이 없습니다."),
    REJECT_MODIFYING_LOG(HttpStatus.FORBIDDEN, "로그 수정/삭제 권한이 없습니다.");

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
