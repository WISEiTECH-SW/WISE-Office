package kr.co.wise.office.api.dto.approve;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 품의서 수정은 품의서 번호와 품의자만 바뀌도록 (260312)
 */
public record ApproveUpdateRequest(
        @Schema(type = "string", description = "품의서 번호") String reportNo,
        @Schema(type = "string", description = "품의자") String writer
) {}
