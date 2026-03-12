package kr.co.wise.office.api.dto.overview;

import com.fasterxml.jackson.annotation.JsonFormat;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;

import java.time.LocalDate;
import java.time.LocalTime;

public record MonthlyMinutesSummaryResponse(
        @JsonFormat(pattern = "yyyy-MM-dd") LocalDate minutesDate,
        @JsonFormat(pattern = "HH:mm") LocalTime startTime,
        @JsonFormat(pattern = "HH:mm") LocalTime endTime,
        String minutesTitle,
        String attendants,
        Long minutesId
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
