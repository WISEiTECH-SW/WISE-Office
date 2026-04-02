package kr.co.wise.office.domain.member.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record MemberUpdateRequest(
        String team,
        String rank,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate hireDate,
        @Size(min = 8, max = 20, message = "비밀번호는 8자 이상, 20자 이하로 입력해 주세요.") String password,
        String passwordCheck
) {}
