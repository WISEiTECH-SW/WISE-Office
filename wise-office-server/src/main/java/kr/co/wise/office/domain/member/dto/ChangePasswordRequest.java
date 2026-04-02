package kr.co.wise.office.domain.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "비밀번호를 입력해주세요")
        @Size(min = 8, max = 20, message = "비밀번호는 8자 이상, 20자 이하로 입력해 주세요.")
        String password,
        @NotBlank(message = "비밀번호 확인을 입력해주세요")
        @Size(min = 8, max = 20, message = "비밀번호 확인은 8자 이상, 20자 이하로 비밀번호와 동일한 값을 입력해 주세요.")
        String passwordCheck
) { }
