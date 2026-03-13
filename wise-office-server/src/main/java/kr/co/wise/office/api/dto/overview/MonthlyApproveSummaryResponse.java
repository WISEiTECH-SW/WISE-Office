package kr.co.wise.office.api.dto.overview;

import io.swagger.v3.oas.annotations.media.Schema;

public record MonthlyApproveSummaryResponse(
        @Schema(type = "string", description = "품의서 번호") String approveTitle,
        @Schema(type = "number", description = "품의서 ID") Long approveId
) {
}
