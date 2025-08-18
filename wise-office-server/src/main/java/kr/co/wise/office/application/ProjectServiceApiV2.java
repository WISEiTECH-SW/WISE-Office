package kr.co.wise.office.application;

import kr.co.wise.office.domain.Project.Service.ProjectService;
import kr.co.wise.office.domain.Project.dto.ProjectCreateRequest;
import kr.co.wise.office.domain.Project.dto.ProjectDetailResponse;
import kr.co.wise.office.domain.Project.dto.ProjectListResponse;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.service.AttendantService;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class ProjectServiceApiV2 {

    private final ProjectService projectService;
    private final AttendantService attendantService;
    private final MemberService memberService;

    // 메인화면 조회시 모든 프로젝트 간략 정보를 가져오는 메소드
    @Transactional(readOnly = true)
    public List<ProjectListResponse> getAllProjectInfoV2(){
        // 모든 프로젝트 정보 반환
        List<ProjectListResponse> response = projectService.searchAllProjectWithManager();
        // 프로젝트당 매니저 설정 및 참여자 설정
        attendantService.getAttendantsNameV2(response);
        // 정렬
        //response.sort(Comparator.comparingLong(ProjectListResponse::getProjectId).reversed());

        return response;
    }

    // 프로젝트 상세 페이지 접속시 반환되는 페이지
    @Transactional(readOnly = true)
    public ProjectDetailResponse getDetailProjectV2(long projectId, String currentUserEmail) {
        // 현재 로그인한 유저 정보 조회
        MemberEntity LoginUser = memberService.findByEmail(currentUserEmail);

        // 프로젝트 조회
        ProjectDetailResponse response = projectService.searchProjectWithManagerV2(projectId);

        // 참여자 설정 및 수정 유무 확인
        attendantService.getDetailAttendants(response, LoginUser);

        //이후 Log 및 Comment도 가져오는 로직 추가
        return response;
    }


    @Transactional
    public Long createProjectV2(ProjectCreateRequest request, String projectMakerEmail) {
        // 프로젝트 생성자 정보 조회
        MemberEntity creator = memberService.findByEmail(projectMakerEmail);
        // 매니저 정보 조회
        MemberEntity manager = memberService.findById(request.projectManagerId());

        // 프로젝트 생성
        ProjectEntity project = projectService.makeProject(request, creator);

        // 참여자 등록
        List<MemberEntity> workers = memberService.findByIds(request.attendants());
        attendantService.makeAttendantsV2(creator,manager,workers,project);

        return project.getId();
    }
}
