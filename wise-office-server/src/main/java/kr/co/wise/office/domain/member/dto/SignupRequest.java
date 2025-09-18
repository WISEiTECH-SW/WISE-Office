package kr.co.wise.office.domain.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import kr.co.wise.office.api.validation.annotation.ValidPassword;

@ValidPassword
public record SignupRequest(@NotBlank(message = "{notBlank}") String name,
                            @NotBlank(message = "{notBlank}") String password,
                            @NotBlank(message = "{notBlank}") String passwordMatch,
                            @NotBlank(message = "{notBlank}") String team,
                            @NotBlank(message = "{notBlank}") String rank,
                            @NotBlank(message = "{notBlank}") @Email(message = "{login.email}") String email,
                            String profileImage) {
}
