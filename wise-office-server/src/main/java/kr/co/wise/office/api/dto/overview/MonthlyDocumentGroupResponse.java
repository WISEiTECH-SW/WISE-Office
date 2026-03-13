package kr.co.wise.office.api.dto.overview;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record MonthlyDocumentGroupResponse(
        @Schema(type = "string", description = "과제 명 ") String title,
        @Schema(description = "회의록-품의서 쌍") List<MonthlyDocumentPairResponse> pair
) {
    public MonthlyDocumentGroupResponse {
        pair = pair == null ? List.of() : List.copyOf(pair);
    }
}
