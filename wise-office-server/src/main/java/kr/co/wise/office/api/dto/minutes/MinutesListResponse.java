package kr.co.wise.office.api.dto.minutes;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;

public record MinutesListResponse(
         @Schema(description = "회의록 상세 조회를 위한 ID", example = "1") Long minutesId,
         @Schema(description = "회의록 제목", example = "WISEMM2025-090901") String title, // 문서 번호 WISEMM-2026-022601 형태
         @Schema(description = "작성 일자", example = "2026-01-01") String writtenAt // 작성 날짜
) {

    public static MinutesListResponse of(MinutesEntity minutes) {
        return new MinutesListResponse(minutes.getId(), minutes.getTitle(), minutes.getMinutesDate().toString());
    }

}
