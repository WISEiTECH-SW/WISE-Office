package kr.co.wise.office.api.dto.minutes;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record MinutesDetailResponse(
        @Schema(type = "string", description = "저장된 회의록 ID") long minutesId,
        @Schema(type = "number", description = "해당 회의록에 연계된 품의서 ID, 없으면 null") Long approveId,
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
        @Schema(type = "회의 참석자 정보") List<MinutesAttendantsInfo> minutesAttendants,
        @Schema(type = "string", description = "외부 참석자, 형식 X") String instAttendants,
        @Schema(type = "작성자 정보", description = "작성자") MinutesAttendantsInfo writer,
        @Schema(type = "string", description = "회의 내용") String content,
        @Schema(type = "string", description = "회의록 작성 시간") @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime writtenAt
        ){

    public static MinutesDetailResponse from(MinutesEntity minutes, List<MinutesAttendantsInfo> minutesAttendants, Long approveId,
                                             MinutesAttendantsInfo writer) {
        return new MinutesDetailResponse(
                minutes.getId(),
                approveId,
                minutes.getProject().getTitle(),
                minutes.getHost(),
                minutes.getMinutesDate(),
                minutes.getStartTime(),
                minutes.getEndTime(),
                minutes.getLocation(),
                minutes.getPurpose(),
                minutesAttendants,
                minutes.getInstAttendants(),
                writer,
                minutes.getMeetingContent(),
                minutes.getWrittenAt()
        );
    }

}
