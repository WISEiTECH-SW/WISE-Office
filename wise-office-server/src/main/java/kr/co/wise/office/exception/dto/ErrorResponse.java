package kr.co.wise.office.exception.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(
    @Schema(description = "http status code") int status,
    @Schema(description = "에러 메세지") String message,
    @Schema(description = "error") Map<String, String> errors,
    @Schema(description = "에러가 발생한 시간") LocalDateTime timestamp //에러가 발생한 시각
) {
    public static ErrorResponse of(int status, String message, Map<String, String> errors) {
        return new ErrorResponse(status, message, errors, LocalDateTime.now());
    }
}