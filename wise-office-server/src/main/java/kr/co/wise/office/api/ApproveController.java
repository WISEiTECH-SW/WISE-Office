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
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "품의서 API", description = "품의서 CUD API 명세서입니다.")
@RequestMapping("/api/projects/{projectId}")
public class ApproveController {

    private final ApproveServiceApi approveServiceApi;

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
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser) {

        return ResponseEntity.status(HttpStatus.CREATED).body(approveServiceApi.createApprove(projectId, loginUser.getName(), minutesId));
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

}
