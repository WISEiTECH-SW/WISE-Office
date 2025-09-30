package kr.co.wise.office.domain.member.dto;

import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record HireDateUpdateRequest(@DateTimeFormat(pattern = "yyyy-MM-dd")
                                    @NotNull(message = "{notBlank}") LocalDate hireDate) {
}
