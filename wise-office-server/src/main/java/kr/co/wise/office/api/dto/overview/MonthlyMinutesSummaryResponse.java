package kr.co.wise.office.api.dto.overview;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;

import java.time.LocalDate;
import java.time.LocalTime;

public record MonthlyMinutesSummaryResponse(
        @Schema(type = "string", description = "회의 날짜") @JsonFormat(pattern = "yyyy-MM-dd") LocalDate minutesDate,
        @Schema(type = "string", description = "회의 시작 시간") @JsonFormat(pattern = "HH:mm") LocalTime startTime,
        @Schema(type = "string", description = "회의 종료 시간") @JsonFormat(pattern = "HH:mm") LocalTime endTime,
        @Schema(type = "string", description = "회의록 번호") String minutesTitle,
        @Schema(type = "string", description = "참여자 리스트") String attendants,
        @Schema(description = "회의록 ID") Long minutesId
) {


    public static MonthlyMinutesSummaryResponse from(MinutesEntity minutes, String attendants) {
        return new MonthlyMinutesSummaryResponse(
                minutes.getMinutesDate(),
                minutes.getStartTime(),
                minutes.getEndTime(),
                minutes.getTitle(),
                attendants,
                minutes.getId()
        );
    }
}
