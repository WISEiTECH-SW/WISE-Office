package kr.co.wise.office.api.dto.overview;

public record MonthlyDocumentPairResponse(
        MonthlyMinutesSummaryResponse minutes,
        MonthlyApproveSummaryResponse approve
) {
}
