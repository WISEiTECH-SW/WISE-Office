package kr.co.wise.office.domain.Project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ProjectDetailResponse {

    private long projectId;
    private String projectTitle;
    private LocalDate start;
    private LocalDate end;
    private int currentYear;
    private String managerName;
    private List<String> attendant;

    @Schema(description = "상세 조회 프로젝트 수정/삭제 권한 보유 여부 (true: 삭제/수정 가능)")
    private boolean canModify; // 수정 가능한 사람인지 유무

    public static ProjectDetailResponse loadProjectInfo(ProjectEntity projectEntity) {
        ProjectDetailResponse response = new ProjectDetailResponse();
        response.setProjectId(projectEntity.getId());
        response.setProjectTitle(projectEntity.getTitle());
        response.setStart(projectEntity.getStartYear());
        response.setEnd(projectEntity.getEndYear());
        response.setCurrentYear(LocalDate.now().getYear() - projectEntity.getStartYear().getYear() + 1);
        response.setManagerName(projectEntity.getMember().getName());
        response.setCanModify(false);
        return response;
    }



}
