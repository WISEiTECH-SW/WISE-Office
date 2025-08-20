package kr.co.wise.office.domain.Log.dto;

import kr.co.wise.office.domain.Log.entity.LogEntity;

import java.time.LocalDateTime;

public record LogDetailResponse(
        long logId,
        String writer,
        LocalDateTime createdAt,
        String content,
        String imageUrl,
        boolean canModify,
        String title
) {



    /**
     * LogEntity와 수정 가능 여부를 받아 DTO를 생성하는 정적 팩토리 메서드
     */
    public static LogDetailResponse from(LogEntity logEntity, boolean canModify) {
        // record의 생성자를 직접 호출하여 불변 객체를 생성
        return new LogDetailResponse(
                logEntity.getId(),
                logEntity.getMember().getName(),
                logEntity.getWrittenAt(),
                logEntity.getLogDetail(),
                logEntity.getMember().getImageUrl(), // 이미지 URL은 작성자(Member)의 것을 사용
                canModify,
                logEntity.getTitle()
        );
    }
}
