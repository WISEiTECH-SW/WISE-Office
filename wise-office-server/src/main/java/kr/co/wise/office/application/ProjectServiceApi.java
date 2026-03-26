package kr.co.wise.office.application;

import kr.co.wise.office.domain.Project.Service.ProjectService;
import kr.co.wise.office.domain.Project.dto.*;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantRoleType;
import kr.co.wise.office.domain.attendant.service.AttendantService;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.companymember.service.CompanyMemberService;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.domain.member.service.MemberService;
import kr.co.wise.office.domain.proposalattendant.service.ProposalAttendantService;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.UnAuthorizationException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class ProjectServiceApi {

    private final ProjectService projectService;
    private final AttendantService attendantService;
    private final MemberService memberService;
    private final CompanyMemberService companyMemberService;
    private final ProposalAttendantService proposalAttendantService;

    // 프로젝트 상세 페이지 접속시 반환되는 페이지
    @Transactional(readOnly = true)
    public ProjectDetailResponse getDetailProjectV2(long projectId, String userEmail) {
        // 현재 로그인한 유저 정보 조회
        MemberEntity LoginUser = memberService.findByEmail(userEmail);

        // 프로젝트 조회
        ProjectDetailResponse response = projectService.searchProjectWithManagerV2(projectId);

        // 참여자 설정 및 수정 유무 확인
        attendantService.getDetailAttendants(response, LoginUser);


        //이후 Log 및 Comment도 가져오는 로직 추가
        return response;
    }

    @Transactional
    public ProjectCreateResponse createProjectV2(ProjectCreateRequest request, String userEmail) {
        // 프로젝트 생성자 정보 조회
        MemberEntity creator = memberService.findByEmail(userEmail);
        // 매니저 정보 조회
        MemberEntity pm = memberService.findById(request.projectManagerId());

        // 프로젝트 생성
        ProjectEntity project = projectService.makeProject(request, creator);

        // 참여자 등록
        List<MemberEntity> workers = memberService.findByIds(request.attendants());
        List<String> attendantsName = attendantService.makeAttendantsV2(creator, pm, workers, project);

        // 편성인원 등록
        List<CompanyMemberEntity> proposalAttendants = companyMemberService.findByIds(request.proposalAttendants());
        List<String> proposalAttendantsName = proposalAttendantService.makeProposalAttendants(proposalAttendants,project);

        ProjectCreateResponse response = ProjectCreateResponse.from(project, attendantsName, pm.getName(), proposalAttendantsName);
        return response;
    }

    @Transactional
    public ProjectDetailResponse updateProject(long projectId, String userEmail, ProjectUpdateRequest request) {
        MemberEntity loginUser = memberService.findByEmail(userEmail);
        MemberEntity newManager = memberService.findById(request.projectManagerId());
        ProjectEntity project = projectService.findById(projectId);

        //권한 확인
        checkModifyPermission(loginUser, project);

        //프로젝트 업데이트
        projectService.updateProject(project, request);
        List<MemberEntity> updateAttendantList = memberService.findByIds(request.attendants());
        // 참여자 업데이트
        attendantService.updateAttendants(project, newManager, updateAttendantList);
        // 편성인원 업데이트
        List<CompanyMemberEntity> updateProposalAttendantList = companyMemberService.findByIds(request.proposalAttendants());
        proposalAttendantService.updateProposalAttendants(project, updateProposalAttendantList);

        // 수정된 정보 반환
        ProjectDetailResponse response = projectService.searchProjectWithManager(projectId, userEmail);
        attendantService.getDetailAttendants(response, loginUser);
        return response;
    }

    @Transactional
    public void closeProject(long projectId, String userEmail) {
        MemberEntity loginUser = memberService.findByEmail(userEmail);
        ProjectEntity project = projectService.findById(projectId);

        checkModifyPermission(loginUser, project);

        //프로젝트 종료
        attendantService.leaveAll(project);
        projectService.closeProject(project);
    }

    @Transactional(readOnly = true)
    public ProjectListResponseWithPaging getProjectInfoWithPaging(int page, int offset) {
        PageRequest pageable = PageRequest.of(page, offset, Sort.by("id").descending());
        Page<ProjectEntity> projectsWithPaging = projectService.searchProjectWithManagerWithPaging(pageable);

        //페이징 정보 조회
        ProjectListResponseWithPaging.PageNationInfo pageNationInfo = ProjectListResponseWithPaging.PageNationInfo.of(projectsWithPaging);
        List<ProjectEntity> projects = projectsWithPaging.getContent();
        List<ProjectListResponse> projectListResponses = projects.stream().map(ProjectListResponse::loadProjectInfo).toList();

        attendantService.getAttendantsNameV2(projectListResponses);
        return new ProjectListResponseWithPaging(pageNationInfo, projectListResponses);
    }

    @Transactional(readOnly = true)
    public List<ProjectGroupByYearResponse> getProjectsGroupByYear() {
        return projectService.getProjectsGroupByYear();
    }

    private void checkModifyPermission(MemberEntity loginUser, ProjectEntity project) {
        boolean isAdmin = loginUser.getRoleType() == MemberRoleType.MASTER;

        if(isAdmin) {
            return;
        }

        AttendantEntity attendant = attendantService.validateParticipatingProject(loginUser, project);
        boolean isWorker = attendant.getRole() == AttendantRoleType.WORKER;
        if (isWorker) {
            throw new UnAuthorizationException(ErrorMessage.REJECT_MODIFYING_PROJECT);
        }
    }
}
