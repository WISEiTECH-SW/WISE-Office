package kr.co.wise.office.api.dto.proposal_attendant;

import io.swagger.v3.oas.annotations.media.Schema;

public record PossibleAttendantsResponse(
        @Schema(description = "전달해야 하는 값") long memberId,
        @Schema(description = "이름") String name,
        @Schema(description = "직급") String rank,
        @Schema(description = "회의 참석 가능 여부 (true : 가능, false : 불가능)") boolean canAttend
) {}
