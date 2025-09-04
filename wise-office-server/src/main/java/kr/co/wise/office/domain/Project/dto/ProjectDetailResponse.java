package kr.co.wise.office.domain.Project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.dto.AttendantDetail;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ProjectDetailResponse {

    private long projectId;
    private String projectTitle;
    private String detail;
    private LocalDate start;
    private LocalDate end;
    private int currentYear;
    private AttendantDetail managerName;
    private List<AttendantDetail> attendant;

    @Schema(description = "상세 조회 프로젝트 수정/삭제 권한 보유 여부 (true: 삭제/수정 가능)")
    private boolean canModify; // 수정 가능한 사람인지 유무
    @Schema(description = "현재 프로젝트에 참여중인 사람인지 (true : 참여, false : 미참여)")
    private boolean isAttending;

    public static ProjectDetailResponse loadProjectInfo(ProjectEntity projectEntity) {
        ProjectDetailResponse response = new ProjectDetailResponse();
        response.setProjectId(projectEntity.getId());
        response.setProjectTitle(projectEntity.getTitle());
        response.setStart(projectEntity.getStartYear());
        response.setEnd(projectEntity.getEndYear());
        response.setDetail(projectEntity.getDetail());
        response.setCurrentYear(LocalDate.now().getYear() - projectEntity.getStartYear().getYear() + 1);
        response.setCanModify(false);
        return response;
    }



}
