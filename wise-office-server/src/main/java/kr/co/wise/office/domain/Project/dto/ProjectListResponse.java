package kr.co.wise.office.domain.Project.dto;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ProjectListResponse {

    private long projectId;
    private String projectTitle;
    private LocalDate start;
    private LocalDate end;
    private int currentYear;
    private String managerName;
    private List<String> attendant;

    public static ProjectListResponse loadProjectInfo(ProjectEntity projectEntity) {
        ProjectListResponse response = new ProjectListResponse();
        response.setProjectId(projectEntity.getId());
        response.setProjectTitle(projectEntity.getTitle());
        response.setStart(projectEntity.getStartYear());
        response.setEnd(projectEntity.getEndYear());
        response.setCurrentYear(LocalDate.now().getYear() - projectEntity.getStartYear().getYear() + 1);
        response.managerName = projectEntity.getMember().getName();
        return response;
    }

}
