package kr.co.wise.office.api.dto.minutes;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import kr.co.wise.office.api.validation.annotation.SubjectNotBlank;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record MinutesUpdateRequest(
        @Schema(type = "string", description = "회의주관기관") @SubjectNotBlank(subject = "회의주관기관") String host,
        @Schema(type = "string", description = "회의장소") @SubjectNotBlank(subject = "회의장소") String location,
        @Schema(type = "string", description = "회의목적") @SubjectNotBlank(subject = "회의목적") String purpose,
        @Schema(type = "string", description = "회의일시 (YYYY-MM-dd) 형태로 전달", defaultValue = "2026-02-27") @DateTimeFormat(pattern = "yyyy-MM-dd")
        LocalDate minutesDate,
        @Schema(type = "string", description = "회의시작시간 (HH:mm) 형태로 전달 ", defaultValue = "14:30") @DateTimeFormat(pattern = "HH:mm") @NotNull LocalTime startTime,
        @Schema(type = "string", description = "회의종료시간 (HH:mm) 형태로 전달 ", defaultValue =  "16:30") @DateTimeFormat(pattern = "HH:mm") @NotNull LocalTime endTime,
        @Schema(description = "사내 참석자") List<Long> minutesAttendants,
        @Schema(type = "string", description = "외부 참석자, 형식 X") @SubjectNotBlank(subject = "외부 기관 참석자") String instAttendants,
        @Schema(type = "string", description = "작성자") @SubjectNotBlank(subject = "작성자") Long writer,
        @Schema(type = "string", description = "회의 내용") @SubjectNotBlank(subject = "회의 내용") String content
) {}
