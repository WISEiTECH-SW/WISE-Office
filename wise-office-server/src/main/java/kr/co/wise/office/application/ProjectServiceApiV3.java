package kr.co.wise.office.application;

import kr.co.wise.office.domain.Project.Service.ProjectService;
import kr.co.wise.office.domain.Project.dto.ProjectListResponse;
import kr.co.wise.office.domain.Project.dto.ProjectListResponseWithPaging;
import kr.co.wise.office.domain.Project.dto.ProjectGroupByYearResponse;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.service.AttendantService;
import kr.co.wise.office.domain.member.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
public class ProjectServiceApiV3 {

    private final ProjectService projectService;
    private final AttendantService attendantService;
    private final MemberService memberService;

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
}
