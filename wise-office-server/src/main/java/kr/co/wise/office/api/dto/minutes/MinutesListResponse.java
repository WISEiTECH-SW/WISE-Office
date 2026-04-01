package kr.co.wise.office.api.dto.minutes;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;

public record MinutesListResponse(
         @Schema(description = "회의록 상세 조회를 위한 ID", example = "1") Long minutesId,
         @Schema(description = "회의록 제목", example = "WISEMM2025-090901") String title, // 문서 번호 WISEMM-2026-022601 형태
         @Schema(description = "회의 날짜", example = "2026-01-01") String minutesAt, // 작성 날짜
         @Schema(description = "작성자", example = "홍길동") String writer,
         @Schema(description = "회의 목적", example = "과제 정기 회의") String purpose
) {

    public static MinutesListResponse from(MinutesEntity minutes, CompanyMemberEntity companyMember) {
        return new MinutesListResponse(minutes.getId(), minutes.getTitle(), minutes.getMinutesDate().toString(),
                companyMember.getName() + " " + companyMember.getRank(), minutes.getPurpose());
    }

}
