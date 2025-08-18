package kr.co.wise.office.domain.Log.dto;

import kr.co.wise.office.domain.Log.entity.LogEntity;
import lombok.Data;

import java.time.LocalDateTime;


@Data
public class LogListResponse{

    private long logId;
    private String title;
    private String writer;
//    private String imageUrl;
    private LocalDateTime createdAt;
    private int commentCnt;
    private boolean canModify;

    public static LogListResponse loadLogInfo(LogEntity logEntity) {
        LogListResponse response = new LogListResponse();
        response.setLogId(logEntity.getId());
        response.setTitle(logEntity.getTitle());
        response.setWriter(logEntity.getMember().getName());
//        response.setImageUrl(logEntity.getMember().getImageUrl());
        response.setCreatedAt(logEntity.getWrittenAt());
        response.setCommentCnt(logEntity.getComments().size());
        response.setCanModify(false);
        return response;
    }



}
