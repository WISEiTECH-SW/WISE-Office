package kr.co.wise.office.application;

import kr.co.wise.office.domain.Log.dto.*;
import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.Log.service.LogService;
import kr.co.wise.office.domain.Project.Service.ProjectService;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantRoleType;
import kr.co.wise.office.domain.attendant.service.AttendantService;
import kr.co.wise.office.domain.comment.service.CommentService;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.domain.member.service.MemberService;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.UnAuthorizationException;
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
    private final CommentService commentService;

    @Transactional
    public long createLog(String loginUserEmail, long projectId, LogCreateRequest request) {
        MemberEntity loginUser = memberService.findByEmail(loginUserEmail);
        ProjectEntity project = projectService.findById(projectId);
        attendantService.validateParticipatingProject(loginUser, project);

        return logService.createLog(request, loginUser, project);
    }

    public List<LogListResponse> getAllLogs(long projectId, String loginUserEmail) {
        MemberEntity loginUser = memberService.findByEmail(loginUserEmail);
        ProjectEntity project = projectService.findById(projectId);
        AttendantEntity attendant = attendantService.validateParticipatingProject(loginUser, project);

        // 프로젝트 내 모든 로그 조회
        List<LogEntity> logEntities = logService.searchAllLogs(project);

        return logEntities.stream()
                .map(log -> LogListResponse.from(log, hasModifyPermission(loginUser, attendant, log)))
                .toList();
    }

    public LogDetailResponse getDetailLog(long logId, long projectId, String loginUserEmail) {
        // 필요한 정보 조회
        MemberEntity loginUser = memberService.findByEmail(loginUserEmail);
        ProjectEntity project = projectService.findById(projectId);
        AttendantEntity attendant = attendantService.validateParticipatingProject(loginUser, project);
        LogEntity log = logService.searchLog(logId);

        return LogDetailResponse.from(log, hasModifyPermission(loginUser,attendant,log));
    }

    @Transactional
    public LogUpdateResponse updateLog(long projectId, long logId, String loginUserEmail, LogUpdateRequest request) {
        LogEntity log = getLogIfAuthorized(projectId, logId, loginUserEmail);

        LogEntity updatedLog = logService.updateLog(log, request);
        return new LogUpdateResponse(updatedLog.getTitle(), updatedLog.getLogDetail());
    }

    @Transactional
    public void removeLog(long projectId, long logId, String loginUserEmail) {
        LogEntity log = getLogIfAuthorized(projectId, logId, loginUserEmail);

        commentService.removeCommentByLog(log);
        logService.removeLog(log);
    }

    /**
     * 로그 조작를 위한 필요한 entity 수집 및 해당 로그 권한을 확인하는 메소드
     * @param projectId : 조회할 프로젝트 번호
     * @param logId : 프로젝트의 로그 번호
     * @param loginUserEmail : 현재 로그인한 유저 이메일
     * @return
     */
    private LogEntity getLogIfAuthorized(long projectId, long logId, String loginUserEmail) {
        // 필요한 정보 조회
        MemberEntity loginUser = memberService.findByEmail(loginUserEmail);
        ProjectEntity project = projectService.findById(projectId);
        AttendantEntity attendant = attendantService.validateParticipatingProject(loginUser, project);
        LogEntity log = logService.searchLog(logId);

        if (!hasModifyPermission(loginUser, attendant, log)) {
            throw new UnAuthorizationException(ErrorMessage.REJECT_MODIFYING_LOG);
        }

        return log;
    }

    /**
     * 해당 로그를 수정/삭제할 수 있는 권한이 있는 유저인지 확인하는 메소드
     * 로그 수정/삭제는 해당 프로젝트의 PM/로그 작성자/ADMIN 권한을 가진 계정만 가능
     * @param loginUser : 현재 로그인한 유저 정보
     * @param attendant : 현재 로그인한 유저의 프로젝트 참여 정보
     * @param log : 수정/삭제할 로그 
     * @return true : 수정/삭제 가능, false : 수정/삭제 불가
     */
    private boolean hasModifyPermission(MemberEntity loginUser, AttendantEntity attendant, LogEntity log) {
        boolean isAdmin = loginUser.getRoleType().equals(MemberRoleType.MASTER); // ADMIN 권한 확인
        boolean isPM = attendant.getRole().equals(AttendantRoleType.PM); // PM 확인
        boolean isWriter = log.getMember().getId().equals(loginUser.getId()); // 작성자인지 확인

        return isAdmin || isPM || isWriter;
    }
}
