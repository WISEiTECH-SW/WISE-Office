package kr.co.wise.office.api.dto.minutes;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;

import java.time.LocalDate;
import java.time.LocalTime;

public record MinutesDetailResponse(
        @Schema(type = "string", description = "저장된 회의록 ID") long minutesId,
        @Schema(type = "string", description = "과제명") String title,
        @Schema(type = "string", description = "회의주관기관") String host,
        @Schema(type = "string", description = "회의일시 (YYYY-MM-dd) 형태로 전달", defaultValue = "2026-02-27") @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate minutesDate,
        @Schema(type = "string", description = "회의시작시간 (HH:mm) 형태로 전달 ", defaultValue = "14:30") @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,
        @Schema(type = "string", description = "회의종료시간 (HH:mm) 형태로 전달 ", defaultValue =  "16:30") @JsonFormat(pattern = "HH:mm")
        LocalTime endTime,
        @Schema(type = "string", description = "회의장소") String location,
        @Schema(type = "string", description = "회의목적") String purpose,
        @Schema(type = "string", description = "사내 참석자 (ex) 이름,이름,이름 형태의 문자열 값으로 전달)") String minutesAttendants,
        @Schema(type = "string", description = "외부 참석자, 형식 X") String instAttendants,
        @Schema(type = "string", description = "작성자") String writer,
        @Schema(type = "string", description = "회의 내용") String meetingContent
){

    public static MinutesDetailResponse from(MinutesEntity minutes, String minutesAttendants) {
        return new MinutesDetailResponse(
                minutes.getId(),
                minutes.getProject().getTitle(),
                minutes.getHost(),
                minutes.getMinutesDate(),
                minutes.getStartTime(),
                minutes.getEndTime(),
                minutes.getLocation(),
                minutes.getPurpose(),
                minutesAttendants,
                minutes.getInstAttendants(),
                minutes.getWriter(),
                minutes.getMeetingContent());
    }

}
