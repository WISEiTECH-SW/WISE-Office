package kr.co.wise.office.domain.Project.dto;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;

import java.time.LocalDate;
import java.util.List;

/**
 *
 * @param projectTitle 프로젝트 제목
 * @param start 프로젝트 시작 시간
 * @param end 프로젝트 종료 시간
 * @param content 프로젝트 내용
 * @param attendants 참여 인력 데이터베이스 PK 값
 */
public record ProjectCreateRequest(String projectTitle,
                               LocalDate start,
                               LocalDate end,
                               String content,
                               List<Long> attendants) {

}
