package kr.co.wise.office.api.dto.minutes;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;

import java.time.LocalDate;
import java.time.LocalTime;

public record MinutesDetailResponse(
        long minutesId,
        String host,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate minutesDate,
        @Schema(example = "14:00") @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,
        @Schema(example = "16:00") @JsonFormat(pattern = "HH:mm")
        LocalTime endTime,
        String location,
        String purpose,
        String attendants,
        String writer,
        String content
){

    public static MinutesDetailResponse of(MinutesEntity minutes) {
        return new MinutesDetailResponse(
                minutes.getId(),
                minutes.getHost(),
                minutes.getMinutesDate(),
                minutes.getStartTime(),
                minutes.getEndTime(),
                minutes.getLocation(),
                minutes.getPurpose(),
                minutes.getInstAttendants(),
                minutes.getWriter(),
                minutes.getMeetingContent());
    }

}
