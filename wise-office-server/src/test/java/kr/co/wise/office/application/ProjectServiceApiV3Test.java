package kr.co.wise.office.application;

import kr.co.wise.office.domain.Project.dto.ProjectCreateRequest;
import kr.co.wise.office.domain.Project.dto.ProjectListResponse;
import kr.co.wise.office.domain.Project.dto.ProjectListResponseWithPaging;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class ProjectServiceApiV3Test extends BaseTestEntity {

    @Autowired
    private ProjectServiceApiV3 projectServiceApiV3;

    private static final LocalDate BASE_DATE = LocalDate.of(2025, 1, 1);

    @BeforeEach
    public void setup() {
        for (int i = 0; i <= 99; i++) {
            ProjectCreateRequest content = createProjectRequest("title" + (i + 1), "content",
                    pm.getId(), List.of(worker1.getId(), worker2.getId()));
            projectServiceApiV2.createProjectV2(content, creator.getEmail());
        }
    }

    @Test
    @DisplayName("정상적인 페이징 조회가 되어야 한다.")
    void success_paging() {
        //given
        int page = 0;
        int offset = 6;
        List<String> resultTitle = new ArrayList<>();
        for (int i = 100; i > 100 - offset; i--) {
            resultTitle.add("title" + i);
        }

        //then
        ProjectListResponseWithPaging projectInfoWithPaging = projectServiceApiV3.getProjectInfoWithPaging(page, offset);
        ProjectListResponseWithPaging.PageNationInfo pageNationInfo = projectInfoWithPaging.getPageNationInfo();
        List<ProjectListResponse> projectListResponses = projectInfoWithPaging.getProjectListResponses();

        assertThat(pageNationInfo.getCurrentPage()).isEqualTo(page + 1);
        assertThat(pageNationInfo.getPageSize()).isEqualTo(offset);
        assertThat(pageNationInfo.getTotalCount()).isEqualTo(101);
        assertThat(pageNationInfo.getTotalPages()).isEqualTo(17);
        assertThat(projectListResponses.stream().map(ProjectListResponse::getProjectTitle).toList())
                .containsExactlyElementsOf(resultTitle);
    }

    @Test
    @DisplayName("마지막 페이지는 남은 개수만 조회되어야한다.")
    void success_paging2(){
        //given
        int page = 16;
        int offset = 6;

        List<String> resultTitle = List.of("title4", "title3", "title2", "title1", "title");

        //when
        ProjectListResponseWithPaging projectInfoWithPaging = projectServiceApiV3.getProjectInfoWithPaging(page, offset);
        ProjectListResponseWithPaging.PageNationInfo pageNationInfo = projectInfoWithPaging.getPageNationInfo();
        List<ProjectListResponse> projectListResponses = projectInfoWithPaging.getProjectListResponses();

        //then
        assertThat(pageNationInfo.getCurrentPage()).isEqualTo(page + 1);
        assertThat(pageNationInfo.getPageSize()).isEqualTo(5);
        assertThat(pageNationInfo.getTotalCount()).isEqualTo(101);
        assertThat(pageNationInfo.getTotalPages()).isEqualTo(17);
        assertThat(projectListResponses.stream().map(ProjectListResponse::getProjectTitle).toList())
                .containsExactlyElementsOf(resultTitle);
    }


    @Test
    @DisplayName("마지막 페이지 이후 페이지 조회는 데이터가 조회되지않는다.")
    void success_paging_over_last(){
        //given
        int page = 20;
        int offset = 6;

        //when
        ProjectListResponseWithPaging projectInfoWithPaging = projectServiceApiV3.getProjectInfoWithPaging(page, offset);
        ProjectListResponseWithPaging.PageNationInfo pageNationInfo = projectInfoWithPaging.getPageNationInfo();
        List<ProjectListResponse> projectListResponses = projectInfoWithPaging.getProjectListResponses();

        //then
        assertThat(pageNationInfo.getCurrentPage()).isEqualTo(page + 1);
        assertThat(pageNationInfo.getPageSize()).isEqualTo(0);
        assertThat(pageNationInfo.getTotalCount()).isEqualTo(101);
        assertThat(pageNationInfo.getTotalPages()).isEqualTo(17);
        assertThat(projectListResponses.stream().map(ProjectListResponse::getProjectTitle).toList()).isEmpty();
    }

}
