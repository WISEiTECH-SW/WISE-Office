package kr.co.wise.office.domain.member.dto;

import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @Size(min = 8, max = 20, message = "비밀번호는 8자 이상, 20자 이하로 입력해 주세요.") String password,
        String passwordCheck
) { }
