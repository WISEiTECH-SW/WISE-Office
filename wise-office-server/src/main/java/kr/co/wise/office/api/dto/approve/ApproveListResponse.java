package kr.co.wise.office.api.dto.approve;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.util.DateUtil;

public record ApproveListResponse(
        @Schema(type = "number", description = "품의서 ID") long approveId,
        @Schema(type = "string", description = "품의서 제목 (WISEBMXXXX-XXXX") String title,
        @Schema(type = "string", description = "접수일자") String submitDate,
        @Schema(type = "string", description = "작성자") String writer
) {
    public static ApproveListResponse from(ApproveEntity approve) {
        return new ApproveListResponse(
                approve.getId(),
                approve.getReportNo(),
                approve.getSubmitDate().format(DateUtil.approveDateFormatter),
                approve.getWriter()
        );
    }
}
