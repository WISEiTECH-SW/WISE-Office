package kr.co.wise.office.domain.member.dto;

public record ChangePasswordRequest(
        String successToken,
        String password,
        String passwordCheck
) { }
