package kr.co.wise.office.domain.Log.dto;

import kr.co.wise.office.api.validation.annotation.SubjectNotBlank;


public record LogUpdateRequest(@SubjectNotBlank(subject = "업데이트할 로그의 제목") String title,
                               @SubjectNotBlank(subject = "업데이트할 로그의 본문") String content) {
}
