package kr.co.wise.office.domain.Project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@AllArgsConstructor
public class ProjectListResponseWithPaging {

    @Builder
    @Data
    public static class PageNationInfo {
        private int currentPage;
        private int pageSize;
        private int totalCount;
        private int totalPages;

        public static <T> PageNationInfo of(Page<T> pageable) {
            int currentPage = pageable.getNumber();
            int pageSize = pageable.getNumberOfElements();
            int totalProjectNumber = (int) pageable.getTotalElements();
            int lastPageNumber = pageable.getTotalPages();
            return PageNationInfo.builder()
                    .currentPage(currentPage+1)
                    .pageSize(pageSize)
                    .totalPages(lastPageNumber)
                    .totalCount(totalProjectNumber)
                    .build();
        }
    }

    private PageNationInfo pageNationInfo;
    private List<ProjectListResponse> projectListResponses;
}
