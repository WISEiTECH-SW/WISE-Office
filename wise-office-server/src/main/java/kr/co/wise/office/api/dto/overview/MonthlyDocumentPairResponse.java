package kr.co.wise.office.api.dto.overview;

import io.swagger.v3.oas.annotations.media.Schema;

public record MonthlyDocumentPairResponse(
        @Schema(description = "회의록 정보") MonthlyMinutesSummaryResponse minutes,
        @Schema(description = "품의서 정보")  MonthlyApproveSummaryResponse approve
) {
}
