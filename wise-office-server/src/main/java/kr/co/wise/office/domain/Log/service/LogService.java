package kr.co.wise.office.domain.Log.service;

import kr.co.wise.office.domain.Log.dto.LogCreateRequest;
import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.Log.repository.LogRepository;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
public class LogService {

    private final LogRepository logRepository;


    public long createLog(LogCreateRequest request, MemberEntity loginUser, ProjectEntity project) {
        LogEntity log = request.toEntity(loginUser, project);

        return logRepository.save(log).getId();
    }

    public List<LogEntity> searchAllLogs(ProjectEntity project) {
        return logRepository.findByLogWithComments(project).orElse(Collections.emptyList());
    }

    public LogEntity searchLog(long logId) {
        return logRepository.findByIdWithMember(logId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 로그입니다."));
    }

}
