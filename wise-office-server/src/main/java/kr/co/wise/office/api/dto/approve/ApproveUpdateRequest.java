package kr.co.wise.office.api.dto.approve;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;

public record ApproveUpdateRequest(
        @Schema(type = "string", description = "품의서 번호") String reportNo,
        @Pattern(
                regexp = "^\\d{4}\\.(0[1-9]|1[0-2])\\.(0[1-9]|[12]\\d|3[01])\\.$",
                message = "날짜 형식은 YYYY.MM.dd. 이어야 합니다.")
        @Schema(type = "string", description = "작성일자", defaultValue = "2026.01.01.")
        String writtenAt,
        @Pattern(
                regexp = "^\\d{4}\\.(0[1-9]|1[0-2])\\.(0[1-9]|[12]\\d|3[01])\\.$",
                message = "날짜 형식은 YYYY.MM.dd. 이어야 합니다."
        )
        @Schema(type = "string", description = "접수일자", defaultValue = "2026.02.01.")
        String submitAt,
        @Schema(type = "string", description = "품의자") String writer
) {}
