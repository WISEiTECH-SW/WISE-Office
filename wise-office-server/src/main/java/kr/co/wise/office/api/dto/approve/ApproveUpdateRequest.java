package kr.co.wise.office.api.dto.approve;

import io.swagger.v3.oas.annotations.media.Schema;

public record ApproveUpdateRequest(
        @Schema(type = "number", description = "수정 대상 품의서 ID") long approveId,
        @Schema(type = "string", description = "품의서 번호") String reportNo,
        @Schema(type = "string", description = "작성일자", defaultValue = "2026.01.01.") String writtenAt,
        @Schema(type = "string", description = "접수일자", defaultValue = "2026.02.01.") String submitAt,
        @Schema(type = "string", description = "품의자") String writer
) {}
