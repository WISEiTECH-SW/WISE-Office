package kr.co.wise.office.api.dto.minutes;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import kr.co.wise.office.api.validation.annotation.SubjectNotBlank;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;

public record MinutesCreateRequest(
        @SubjectNotBlank(subject = "회의주관기관") String host,
        @SubjectNotBlank(subject = "회의장소") String location,
        @SubjectNotBlank(subject = "회의목적") String purpose,
        @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate minutesDate,
        @Schema(type = "string", defaultValue = "14:30") @DateTimeFormat(pattern = "HH:mm") @NotNull LocalTime startTime,
        @Schema(type = "string", defaultValue =  "16:30") @DateTimeFormat(pattern = "HH:mm") @NotNull LocalTime endTime,
        @SubjectNotBlank(subject = "참석자") String attendants,
        @SubjectNotBlank(subject = "작성자") String writer,
        @SubjectNotBlank(subject = "회의 내용") String content
) {

}
