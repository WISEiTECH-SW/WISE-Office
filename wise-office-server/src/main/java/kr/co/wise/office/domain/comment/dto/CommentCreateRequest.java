package kr.co.wise.office.domain.comment.dto;

import kr.co.wise.office.api.validation.annotation.SubjectNotBlank;

public record CommentCreateRequest(@SubjectNotBlank(subject = "댓글") String content) {
}
