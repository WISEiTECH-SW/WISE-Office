package kr.co.wise.office.api.dto.approve;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import lombok.Builder;

@Builder
public record ApproveUpdateResponse(
        @Schema(type = "number", description = "수정된 품의서 ID") long approveId,
        @Schema(type = "string", description = "수정된 품의서 번호") String reportNo,
//        @Schema(type = "string", description = "수정된 작성일자", defaultValue = "2026.01.01.") String writtenAt,
        @Schema(type = "string", description = "수정된 작성자")String writer
//        @Schema(type = "string", description = "수정된 접수일자", defaultValue = "2026.01.01.") String submitAt
) {

    public static ApproveUpdateResponse from(ApproveEntity approve) {
        return ApproveUpdateResponse.builder()
                .approveId(approve.getId())
                .reportNo(approve.getReportNo())
//                .writtenAt(approve.getWriteDate().format(DateUtil.writtenAtDateFormatter))
//                .submitAt(approve.getSubmitDate().format(DateUtil.writtenAtDateFormatter))
                .writer(approve.getWriter())
                .build();
    }


}
