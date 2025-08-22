package kr.co.wise.office.domain.Project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.co.wise.office.api.validation.annotation.ValidDateRange;

import java.time.LocalDate;
import java.util.List;

/**
 *
 * @param projectTitle 프로젝트 제목
 * @param start 프로젝트 시작 시간
 * @param end 프로젝트 종료 시간
 * @param content 프로젝트 내용
 * @param projectManagerId 프로젝트 매니저 ID
 * @param attendants 참여 인력 데이터베이스 PK 값
 */
@ValidDateRange
public record ProjectUpdateRequest(@NotBlank(message = "프로젝트 제목은 빈칸일 수 없습니다.") String projectTitle,
                                   @NotNull(message = "시작일이 있어야 합니다.") LocalDate start,
                                   @NotNull(message = "종료일이 있어야 합니다.") LocalDate end,
                                   @NotBlank(message = "프로젝트 내용은 빈칸일 수 없습니다.") String content,
                                   @NotNull(message = "프로젝트 PM은 반드시 지정되어야 합니다.") Long projectManagerId,
                                   List<Long> attendants) {

}

