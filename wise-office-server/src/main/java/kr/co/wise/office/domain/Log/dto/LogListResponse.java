package kr.co.wise.office.domain.Log.dto;

import kr.co.wise.office.domain.Log.entity.LogEntity;

import java.time.LocalDateTime;


public record LogListResponse(
        long logId,
        String title,
        String writer,
        LocalDateTime createdAt,
        int commentCnt,
        // String imageUrl
        boolean canModify
) {

    public static LogListResponse from(LogEntity logEntity, boolean canModify) {
        return new LogListResponse(
                logEntity.getId(),
                logEntity.getTitle(),
                logEntity.getMember().getName(),
                logEntity.getWrittenAt(),
                logEntity.getComments().size(),
                // logEntity.getMember().getImageUrl(),
                canModify // 파라미터로 받은 canModify 값을 그대로 사용
        );
    }
}
