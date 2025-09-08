package kr.co.wise.office.domain.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import kr.co.wise.office.api.validation.annotation.ValidPassword;

@ValidPassword
public record SignupRequest(@NotBlank(message = "빈 값일 수 없습니다.") String name,
                            @NotBlank(message = "빈 값일 수 없습니다.") String password,
                            @NotBlank(message = "빈 값일 수 없습니다.") String passwordMatch,
                            @NotBlank(message = "빈 값일 수 없습니다.") String team,
                            @NotBlank(message = "빈 값일 수 없습니다.") String rank,
                            @NotBlank(message = "빈 값일 수 없습니다.") @Email(message = "이메일 형식이여야합니다.") String email,
                            String profileImage) {
}
