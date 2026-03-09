package kr.co.wise.office.domain.Project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public record ProjectCreateRequest(
        @NotBlank(message = "{project.title}") @Size(max = 100, message = "{project.title.size}") String projectTitle,
        @NotBlank(message = "{project.institution}") @Size(max = 50, message = "{project.institution.size}") String institution,
        @NotBlank(message = "{project.businessName}") @Size(max = 100, message = "{project.businessName.size}") String businessName,
        @NotNull(message = "{project.start}") LocalDate start,
        @NotNull(message = "{project.end}") LocalDate end,
        @NotBlank(message = "{project.content}") @Size(max = 500, message = "{project.content.size}") String content,
        @NotNull(message = "{project.pm}") Long projectManagerId,
        List<Long> attendants, List<Long> proposalAttendants) {
}
