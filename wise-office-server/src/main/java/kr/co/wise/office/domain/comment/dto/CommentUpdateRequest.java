package kr.co.wise.office.domain.comment.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentUpdateRequest(@NotBlank(message = "{notBlank}") String content) {
}
