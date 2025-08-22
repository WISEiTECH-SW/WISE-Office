package kr.co.wise.office.domain.member.dto;

import jakarta.validation.constraints.NotBlank;

public record MemberPositionUpdateRequest(
        @NotBlank(message = "소속은 반드시 지정되어야 합니다.") String team,
        @NotBlank(message = "직급은 반드시 지정되어야 합니다.") String rank) {
}
