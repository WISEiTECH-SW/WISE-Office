package kr.co.wise.office.domain.member.dto;

public record ResetPasswordRequest(
        String successToken,
        String password,
        String passwordCheck
) { }
