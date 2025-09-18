package kr.co.wise.office.domain.member.dto;

import kr.co.wise.office.api.validation.annotation.SubjectNotBlank;

public record VerificationCodeCreationRequest(
        @SubjectNotBlank(subject = "이메일") String email) {
}
