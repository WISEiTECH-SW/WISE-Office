package kr.co.wise.office.application;

import kr.co.wise.office.domain.Project.Service.ProjectService;
import kr.co.wise.office.domain.Project.dto.ProjectCreateRequest;
import kr.co.wise.office.domain.Project.dto.ProjectDetailResponse;
import kr.co.wise.office.domain.Project.dto.ProjectListResponse;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.service.AttendantService;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.repository.MemberRepository;
import kr.co.wise.office.domain.member.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class ProjectServiceApi {

    private final ProjectService projectService;
    private final AttendantService attendantService;
    private final MemberService memberService;
    private final MemberRepository memberRepository;

    // 메인화면 조회시 모든 프로젝트 간략 정보를 가져오는 메소드
    @Transactional(readOnly = true)
    public List<ProjectListResponse> getAllProjectInfo(){

        List<ProjectListResponse> response = projectService.searchAllProjectWithManager();
        Map<Long, List<String>> attendantsName = attendantService.getAttendantsName(response.stream().map(ProjectListResponse::getProjectId).toList());

        response.forEach(
                project ->
                        project.setAttendant(attendantsName.getOrDefault(project.getProjectId(), new ArrayList<>())));
        // list 반환시 정렬 기준 미정
        //response.sort(Comparator.comparingLong(ProjectListResponse::getProjectId).reversed());

        return response;
    }

    // 프로젝트 상세 페이지 접속시 반환되는 페이지
    public ProjectDetailResponse getDetailProject(long projectId, String currentUserEmail) {
        ProjectDetailResponse response = projectService.searchProjectWithManager(projectId, currentUserEmail);
        Map<Long, List<String>> attendantsName = attendantService.getAttendantsName(List.of(response.getProjectId()));

        response.setAttendant(attendantsName.getOrDefault(response.getProjectId(), Collections.emptyList()));

        //이후 Log 및 Comment도 가져오는 로직 추가

        return response;
    }


    // 프로젝트를 생성하는 메소드
    @Transactional
    public Long createProject(ProjectCreateRequest request, String projectMakerEmail) throws IllegalAccessException { // 반환 타입을 Long으로 변경
        // 작성자 정보 조회
        MemberEntity manager = memberService.findByEmail(projectMakerEmail);

        // ProjectService의 makeProject 호출
        ProjectEntity projectEntity = projectService.makeProject(request, manager);

        //프로젝트 참여자들 조회 및 참여자 테이블 저장
        List<MemberEntity> attendants = memberService.findByIds(request.attendants());
        attendantService.makeAttandants(attendants, projectEntity);

        return projectEntity.getId(); // 생성된 프로젝트 ID 반환
    }

}

