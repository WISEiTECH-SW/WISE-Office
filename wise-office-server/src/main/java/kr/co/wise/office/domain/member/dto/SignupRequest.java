package kr.co.wise.office.domain.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.co.wise.office.api.validation.annotation.ValidPassword;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@ValidPassword
public record SignupRequest(@NotBlank(message = "{notBlank}") String name,
                            @NotBlank(message = "{notBlank}") String password,
                            @NotBlank(message = "{notBlank}") String passwordMatch,
                            @NotBlank(message = "{notBlank}") String team,
                            @NotBlank(message = "{notBlank}") String rank,
                            @NotBlank(message = "{notBlank}") @Email(message = "{login.email}") String email,
                            @DateTimeFormat(pattern = "yyyy-MM-dd") @NotNull(message = "{notBlank}") LocalDate hireDate,
                            String profileImage) {
}
