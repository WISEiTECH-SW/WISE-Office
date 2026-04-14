package kr.co.wise.office.domain.Log.service;

import kr.co.wise.office.api.dto.log.LogWithCountDto;
import kr.co.wise.office.domain.Log.dto.LogCreateRequest;
import kr.co.wise.office.domain.Log.dto.LogUpdateRequest;
import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.Log.repository.LogRepository;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class LogService {

    private final LogRepository logRepository;

    public LogEntity createLog(LogCreateRequest request, MemberEntity loginUser, ProjectEntity project) {
        LogEntity log = request.toEntity(loginUser, project);
        return logRepository.save(log);
    }

    public List<LogEntity> searchAllLogs(ProjectEntity project) {
        return logRepository.findByLogWithComments(project).orElse(Collections.emptyList());
    }

public Page<LogWithCountDto> searchLogPages(ProjectEntity project, Pageable pageable) {
    return logRepository.findLogsWithCommentCount(project, pageable);
}

    public LogEntity searchLog(long logId) {
        return logRepository.findByIdWithMember(logId).orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_LOG));
    }

    public LogEntity updateLog(LogEntity log, LogUpdateRequest request) {
        log.update(request.title(), request.content());
        return logRepository.save(log);
    }

    public void removeLog(LogEntity log) {
        logRepository.deleteLog(log.getId());
    }
}
