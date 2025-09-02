package kr.co.wise.office.domain.member.dto;

public record EmailVerificationRequest(String email, String code) {
}
