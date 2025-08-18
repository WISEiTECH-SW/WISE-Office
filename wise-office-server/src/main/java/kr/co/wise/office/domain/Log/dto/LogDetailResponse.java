package kr.co.wise.office.domain.Log.dto;

import kr.co.wise.office.domain.Log.entity.LogEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LogDetailResponse {

    private long logId;
    private String writer;
    private LocalDateTime createdAt;
    private String content;
    private String imageUrl;
    private boolean canModify;
    private String title;



    public static LogDetailResponse loadLogInfo(LogEntity logEntity) {
        LogDetailResponse response = new LogDetailResponse();
        response.setLogId(logEntity.getId());
        response.setTitle(logEntity.getTitle());
        response.setWriter(logEntity.getMember().getName());
        response.setCreatedAt(logEntity.getWrittenAt());
        response.setImageUrl(logEntity.getMember().getImageUrl());
        response.setContent(logEntity.getLogDetail());
        response.setCanModify(false);
        return response;
    }
}
