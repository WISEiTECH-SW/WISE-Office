package kr.co.wise.office.domain.Project.Service;

import kr.co.wise.office.domain.Project.dto.*;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.Project.repository.ProjectRepository;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import kr.co.wise.office.exception.custom.UnAuthorizationException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.Comparator;

@Service
@AllArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    /**
     * 모든 프로젝트와 매니저를 정보를 페이징없이 반환
     */
    @Transactional(readOnly = true)
    public List<ProjectListResponse> searchAllProjectWithManager() {
        return projectRepository.findAllProjectWithManager()
                .orElse(Collections.emptyList())
                .stream()
                .map(ProjectListResponse::loadProjectInfo).toList();
    }

    /**
     * @param request : 프로젝트 정보
     * @param creator : 프로젝스 생성 매니저 객체
     * @return long : 생성된 프로젝트 PK 번호
     */
    @Transactional
    public ProjectEntity makeProject(ProjectCreateRequest request, MemberEntity creator) {
        ProjectEntity projectEntity = ProjectEntity.builder()
                .title(request.projectTitle())
                .institution(request.institution())
                .businessName(request.businessName())
                .detail(request.content()) // content를 detail로 매핑
                .startYear(request.start())
                .endYear(request.end())
                .member(creator)
                .build();
        return projectRepository.save(projectEntity);
    }

    /**
     * @param projectId        상세 조회할 프로젝트 페이지 번호
     * @param currentUserEmail 현재 로그인 중인 유저의 email
     */
    @Transactional(readOnly = true)
    public ProjectDetailResponse searchProjectWithManager(long projectId, String currentUserEmail) {
        ProjectEntity projectWithManager = projectRepository.findProjectWithManager(projectId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_PROJECT));

        ProjectDetailResponse response = ProjectDetailResponse.loadProjectInfo(projectWithManager);

        if (currentUserEmail.equals("anonymousUser")) {
            throw new UnAuthorizationException(ErrorMessage.NOT_FOUND_MEMBER);
        }

        return response;
    }

    @Transactional(readOnly = true)
    public ProjectDetailResponse searchProjectWithManagerV2(long projectId) {
        ProjectEntity projectWithManager = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_PROJECT));

        ProjectDetailResponse response = ProjectDetailResponse.loadProjectInfo(projectWithManager);

        return response;
    }


    public ProjectEntity findById(long projectId) {
        return projectRepository.findById(projectId).orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_PROJECT));
    }

    public void updateProject(ProjectEntity project, ProjectUpdateRequest request) {
        project.update(request);
        projectRepository.save(project);
    }

    public void closeProject(ProjectEntity project) {
        project.closeProject();
        projectRepository.save(project);
    }

    public Page<ProjectEntity> searchProjectWithManagerWithPaging(PageRequest pageable) {
        Page<ProjectEntity> projectsWithPaging = projectRepository.findProjectsWithPaging(pageable);
        return projectsWithPaging;
    }

   @Transactional(readOnly = true)
    public List<ProjectGroupByYearResponse> getProjectsGroupByYear() {
        final int MAX_YEAR_RANGE = 100; // 안전 범위 제한

        return projectRepository.findAllOrderByYearAndPk()
                .stream()
                .flatMap(project -> {
                    if (project.getStartYear() == null || project.getEndYear() == null) {
                        return Stream.empty();
                    }

                    int start = project.getStartYear().getYear();
                    int end = project.getEndYear().getYear();

                    if (start > end) {
                        return Stream.empty();
                    }

                    if (end - start > MAX_YEAR_RANGE) {
                        end = start + MAX_YEAR_RANGE;
                    }

                    return IntStream.rangeClosed(start, end)
                            .mapToObj(year -> Map.entry(year, project));
                })
                .collect(Collectors.groupingBy(
                        Map.Entry::getKey,
                        Collectors.mapping(Map.Entry::getValue, Collectors.toList())
                ))
                .entrySet()
                .stream()
                .sorted(Map.Entry.<Integer, List<ProjectEntity>>comparingByKey().reversed())
                .map(entry -> new ProjectGroupByYearResponse(
                        entry.getKey(),
                       entry.getValue()
                        .stream()
                        .sorted(Comparator.comparingLong(ProjectEntity::getId))
                        .map(ProjectGroupByYearResponse.ProjectItem::new)
                        .toList()
                ))
                .toList();
    }
}