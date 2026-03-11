package kr.co.wise.office.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kr.co.wise.office.api.dto.approve.*;
import kr.co.wise.office.application.ApproveServiceApi;
import kr.co.wise.office.domain.member.dto.CustomOAuthUser;
import kr.co.wise.office.external.hoilday.HolidayProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@Tag(name = "품의서 API", description = "품의서 CUD API 명세서입니다.")
@RequestMapping("/api/projects/{projectId}")
public class ApproveController {

    private final ApproveServiceApi approveServiceApi;

    private final HolidayProvider holidayProvider;

    @Operation(summary = "품의서 목록 조회 API",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "품의서 목록 조회 결과 반환, 해당 프로젝트에 참여하지 않아도 조회 가능",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            array = @ArraySchema(schema = @Schema(implementation = ApproveListResponse.class))
                    ))
    })
    @GetMapping("/approves")
    public ResponseEntity<List<ApproveListResponse>> getApproveList(
            @Parameter(description = "프로젝트 ID") @PathVariable long projectId) {

        return ResponseEntity.ok(approveServiceApi.getApproveList(projectId));
    }

    @PostMapping("/minutes/{minutesId}/approves")
    @Operation(summary = "품의서 생성 API",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "생성된 품의서 완성본 body 전달",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ApproveCreateResponse.class))),
    })
    public ResponseEntity<ApproveCreateResponse> createApprove(
            @Parameter(description = "프로젝트 ID") @PathVariable long projectId,
            @Parameter(description = "회의록 ID") @PathVariable long minutesId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(description = "회의록 작성 일자") @RequestParam(name = "minutes-date") LocalDate minutesDate) {

        return ResponseEntity.status(HttpStatus.CREATED).body(approveServiceApi.createApprove(projectId, loginUser.getName(), minutesId, minutesDate));
    }

    @Operation(summary = "품의서 상세 조회 API",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "품의서 상세 조회 결과 반환, 해당 프로젝트에 참여하지 않아도 조회 가능",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ApproveDetailResponse.class))),
    })
    @GetMapping("/approves/{approveId}")
    public ResponseEntity<ApproveDetailResponse> getDetailApprove(
            @Parameter(description = "프로젝트 ID") @PathVariable long projectId,
            @Parameter(description = "품의서 ID") @PathVariable long approveId) {

        return ResponseEntity.ok(approveServiceApi.getApproveDetail(approveId));
    }

    @Operation(summary = "품의서 수정 API",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "품의서 수정 결과 반환",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ApproveUpdateResponse.class))),
    })
    @PatchMapping("/approves/{approveId}")
    public ResponseEntity<ApproveUpdateResponse> updateApprove(
            @Parameter(description = "프로젝트 ID") @PathVariable long projectId,
            @Parameter(description = "프로젝트 ID") @PathVariable long approveId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(description = "품의서 수정 폼") @RequestBody @Valid ApproveUpdateRequest request) {

        return ResponseEntity.ok(approveServiceApi.updateApprove(projectId, loginUser.getName(), request, approveId));
    }

    /**
     * 작성일자 및 접수일자 계산
     * 두 일자는 회의록 작성 전날 중, 휴일 및 공휴일이 아닌 평일로 계산
     * 예를 들어 회의 날짜가 2026년 3월 3일인 경우,
     * 3월 2일은 임시 공휴일, 3월 1일, 3월 2일은 주말이므로
     * 기안날짜는 2월 27일어야 함.
     */
    private LocalDate calculateSubmitDate(LocalDate minutesDate) {
        Set<LocalDate> holidaySet = holidayProvider.getHolidaySet(minutesDate.getYear(), minutesDate.getMonthValue());
        LocalDate startDate = minutesDate;
        LocalDate submitDate = minutesDate.minusDays(1);
        while (isWeekend(submitDate) || holidaySet.contains(submitDate)) {
            submitDate = submitDate.minusDays(1);

            // 월이 바뀌는 경우 계산
            if (submitDate.getMonthValue() < startDate.getMonthValue()) {
                holidaySet = holidayProvider.getHolidaySet(submitDate.getYear(), submitDate.getMonthValue());
                startDate = submitDate;
            }
        }
        return submitDate;
    }

    private boolean isWeekend(LocalDate submitDate) {
        DayOfWeek dayOfWeek = submitDate.getDayOfWeek();
        return dayOfWeek == DayOfWeek.SUNDAY || dayOfWeek == DayOfWeek.SATURDAY;
    }

}
