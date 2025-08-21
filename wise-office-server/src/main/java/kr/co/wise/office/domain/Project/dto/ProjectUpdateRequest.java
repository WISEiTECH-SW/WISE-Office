package kr.co.wise.office.domain.Project.dto;

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
public record ProjectUpdateRequest(String projectTitle,
                                   LocalDate start,
                                   LocalDate end,
                                   String content,
                                   Long projectManagerId,
                                   List<Long> attendants) {

}

