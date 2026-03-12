package kr.co.wise.office.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.wise.office.api.dto.overview.MonthlyDocumentGroupResponse;
import kr.co.wise.office.application.OverviewServiceApi;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "오버뷰 페이지 API", description = "월간 문서 조회 API입니다.")
@RequestMapping("/api/projects/documents")
public class OverviewController {

    private final OverviewServiceApi overviewServiceApi;

    @GetMapping
    @Operation(summary = "월간 문서 조회", description = "해당 월에 작성된 회의록과 품의서의 간략 정보를 과제별로 조회합니다.")
    public ResponseEntity<List<MonthlyDocumentGroupResponse>> getMonthlyDocuments(
            @RequestParam(name = "year", required = false) Integer year,
            @RequestParam(name = "month", required = false) Integer month
    ) {
        LocalDate today = LocalDate.now();
        YearMonth yearMonth = YearMonth.of(
                year == null ? today.getYear() : year,
                month == null ? today.getMonthValue() : month
        );

        return ResponseEntity.ok(overviewServiceApi.getMonthlyDocuments(yearMonth));
    }
}
