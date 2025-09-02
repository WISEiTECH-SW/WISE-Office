package kr.co.wise.office.domain.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import kr.co.wise.office.api.validation.annotation.ValidPassword;

@ValidPassword
public record SignupRequest(@NotEmpty(message = "빈 값일 수 없습니다.") String name,
                            @NotEmpty(message = "빈 값일 수 없습니다.") String password,
                            @NotEmpty(message = "빈 값일 수 없습니다.") String passwordMatch,
                            @NotEmpty(message = "빈 값일 수 없습니다.") String team,
                            @NotEmpty(message = "빈 값일 수 없습니다.") String rank,
                            @Email(message = "이메일 형식이여야합니다.") String email,
                            String profileImage) {
}
