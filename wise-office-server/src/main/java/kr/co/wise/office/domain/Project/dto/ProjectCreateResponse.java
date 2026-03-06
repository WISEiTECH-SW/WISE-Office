package kr.co.wise.office.domain.Project.dto;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProjectCreateResponse {

    private long projectId;
    private String projectTitle;
    private LocalDate start;
    private LocalDate end;
    private int currentYear;
    private String managerName;
    private List<String> attendant;
    private List<String> proposalAttendant;

    public static ProjectCreateResponse from(ProjectEntity projectEntity, List<String> attendantsName, String managerName, List<String> proposalAttendantsName) {
        ProjectCreateResponse response = new ProjectCreateResponse();
        response.setProjectId(projectEntity.getId());
        response.setProjectTitle(projectEntity.getTitle());
        response.setStart(projectEntity.getStartYear());
        response.setEnd(projectEntity.getEndYear());
        response.setCurrentYear(LocalDate.now().getYear() - projectEntity.getStartYear().getYear() + 1);
        response.setManagerName(managerName);
        response.setAttendant(attendantsName);
        response.setProposalAttendant(proposalAttendantsName);
        return response;
    }

}
