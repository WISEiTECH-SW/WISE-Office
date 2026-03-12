package kr.co.wise.office.api.dto.overview;

import java.util.List;

public record MonthlyDocumentGroupResponse(
        String title,
        List<MonthlyDocumentPairResponse> pair
) {
    public MonthlyDocumentGroupResponse {
        pair = pair == null ? List.of() : List.copyOf(pair);
    }
}
