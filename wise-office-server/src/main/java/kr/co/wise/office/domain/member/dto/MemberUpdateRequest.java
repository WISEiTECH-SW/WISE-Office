package kr.co.wise.office.domain.member.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public record MemberUpdateRequest(
        String team,
        String rank,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate hireDate
) {}
