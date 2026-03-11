package kr.co.wise.office.domain.Project.dto;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import lombok.Getter;

import java.util.List;

@Getter
public class ProjectGroupByYearResponse {

    private final int year;
    private final List<ProjectItem> projects;

    public ProjectGroupByYearResponse(int year, List<ProjectItem> projects) {
        this.year = year;
        this.projects = projects;
    }

    @Getter
    public static class ProjectItem {
        private final long projectId;
        private final String projectTitle;

        public ProjectItem(ProjectEntity project) {
            this.projectId = project.getId();
            this.projectTitle = project.getTitle();
        }
    }
}