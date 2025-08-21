package kr.co.wise.office.domain.comment.dto;

import kr.co.wise.office.domain.comment.entity.CommentEntity;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record CommentResponse(
        Long id,
        String content,
        String authorName,
        LocalDateTime writtenAt,
        String imageUrl,
        boolean canModify
) {
    public static CommentResponse from(CommentEntity comment, boolean canModify) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorName(comment.getMember().getName())
                .writtenAt(comment.getWrittenAt())
                .canModify(canModify)
                .imageUrl(comment.getMember().getImageUrl())
                .build();
    }
}
