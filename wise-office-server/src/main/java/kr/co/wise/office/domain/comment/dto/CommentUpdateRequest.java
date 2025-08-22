package kr.co.wise.office.domain.comment.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentUpdateRequest(@NotBlank(message = "댓글의 내용은 빈칸일 수 없습니다.") String content) {
}
