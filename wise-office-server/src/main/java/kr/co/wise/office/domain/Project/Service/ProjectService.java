package kr.co.wise.office.domain.Project.Service;

import kr.co.wise.office.domain.Project.dto.ProjectCreateRequest;
import kr.co.wise.office.domain.Project.dto.ProjectDetailResponse;
import kr.co.wise.office.domain.Project.dto.ProjectListResponse;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.Project.repository.ProjectRepository;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final MemberService memberService;

    /**
     * 모든 프로젝트와 매니저를 정보를 페이징없이 반환
     */
     @Transactional(readOnly = true)
    public List<ProjectListResponse> searchAllProjectWithManager(){
        return projectRepository.findAllProjectWithManager()
                .orElse(new ArrayList<>())
                .stream()
                .map(ProjectListResponse::loadProjectInfo).toList();
    }

    /**
     * @param request : 프로젝트 정보
     * @param manager : 프로젝스 생성 매니저 객체
     * @return long : 생성된 프로젝트 PK 번호
     */
    @Transactional
    public ProjectEntity makeProject(ProjectCreateRequest request, MemberEntity manager) {
        ProjectEntity projectEntity = ProjectEntity.builder()
                .title(request.projectTitle())
                .detail(request.content()) // content를 detail로 매핑
                .startYear(request.start())
                .endYear(request.end())
                .member(manager)
                .build();
        return projectRepository.save(projectEntity);
    }

    /**
     * @param projectId 상세 조회할 프로젝트 페이지 번호
     * @param currentUserEmail 현재 로그인 중인 유저의 email
     */
    public ProjectDetailResponse searchProjectWithManager(long projectId, String currentUserEmail) {
        ProjectEntity projectWithManager = projectRepository.findProjectWithManager(projectId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 프로젝트입니다."));

        ProjectDetailResponse response = ProjectDetailResponse.loadProjectInfo(projectWithManager);

        if(!currentUserEmail.equals("anonymousUser")){
            MemberEntity loginUser = memberService.findByEmail(currentUserEmail);
            response.setCanModify(projectWithManager.getMember().getId().equals(loginUser.getId()));
        }

        return response;
    }
}
