package kr.co.wise.office.api.dto.log;

import kr.co.wise.office.domain.Log.entity.LogEntity;
import lombok.Getter;

@Getter
public class LogWithCountDto {

    private final LogEntity log;
    private final Long commentCount;

    public LogWithCountDto(LogEntity log, Long commentCount) {
        this.log = log;
        this.commentCount = commentCount;
    }
}
