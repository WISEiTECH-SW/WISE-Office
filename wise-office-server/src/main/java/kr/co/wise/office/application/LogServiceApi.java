package kr.co.wise.office.application;

import kr.co.wise.office.domain.Log.dto.LogCreateRequest;
import kr.co.wise.office.domain.Log.dto.LogDetailResponse;
import kr.co.wise.office.domain.Log.dto.LogListResponse;
import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.Log.service.LogService;
import kr.co.wise.office.domain.Project.Service.ProjectService;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantRoleType;
import kr.co.wise.office.domain.attendant.service.AttendantService;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.domain.member.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class LogServiceApi {

    private final MemberService memberService;
    private final LogService logService;
    private final AttendantService attendantService;
    private final ProjectService projectService;

    @Transactional
    public long createLog(String loginUserEmail, long projectId, LogCreateRequest request) {
        MemberEntity loginUser = memberService.findByEmail(loginUserEmail);
        ProjectEntity project = projectService.findById(projectId);

        // 로그인한 유저가 해당 프로젝트에 참여중인지 조사
        attendantService.validateParticipatingProject(loginUser, project);

        // Log 생성
        long logId = logService.createLog(request, loginUser, project);

        return logId;
    }

    public List<LogListResponse> getAllLogs(long projectId, String loginUserEmail) {
        MemberEntity loginUser = memberService.findByEmail(loginUserEmail);
        ProjectEntity project = projectService.findById(projectId);
        AttendantEntity attendant = attendantService.validateParticipatingProject(loginUser, project);

        List<LogEntity> logEntities = logService.searchAllLogs(project);
        List<LogListResponse> responses = logEntities.stream().map(
                log -> {
                    LogListResponse response = LogListResponse.loadLogInfo(log);
                    //작성자 확인
                    if (log.getMember().getId().equals(loginUser.getId())) {
                        response.setCanModify(true);
                    }
                    return response;
                }).toList();

        // 로그인한 사람이 ADMIN 계정이거나, 프로젝트 PM인 경우
        if (loginUser.getRoleType().equals(MemberRoleType.MASTER) || attendant.getRole().equals(AttendantRoleType.PM)) {
            responses.forEach(log -> log.setCanModify(true));
        }

        //정렬
        //responses.sort(Comparator.comparing(LogListResponse::getCreatedAt).reversed());

        return responses;
    }

    public LogDetailResponse getDetailLogs(long logId, long projectId, String loginUserEmail) {
        // 필요한 정보 조회
        MemberEntity loginUser = memberService.findByEmail(loginUserEmail);
        ProjectEntity project = projectService.findById(projectId);
        AttendantEntity attendant = attendantService.validateParticipatingProject(loginUser, project);
        LogEntity log = logService.searchLog(logId);

        LogDetailResponse response = LogDetailResponse.loadLogInfo(log);

        // 수정 권한 확인
        boolean isAdmin = loginUser.getRoleType().equals(MemberRoleType.MASTER);
        boolean isPM = attendant.getRole().equals(AttendantRoleType.PM);
        boolean isWriter = log.getMember().getId().equals(loginUser.getId());

        if (isAdmin || isPM || isWriter) {
            response.setCanModify(true);
        }

        return response;
    }
}
