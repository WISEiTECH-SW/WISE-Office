package kr.co.wise.office.domain.member.dto;

import kr.co.wise.office.api.validation.annotation.SubjectNotBlank;

public record LoginRequest(
        @SubjectNotBlank(subject = "이메일") String email,
        @SubjectNotBlank(subject = "비밀번호") String password) {
}
