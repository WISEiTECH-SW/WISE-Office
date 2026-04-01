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
import kr.co.wise.office.application.ProjectServiceApi;
import kr.co.wise.office.domain.Project.dto.*;
import kr.co.wise.office.domain.member.dto.CustomOAuthUser;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j
@Tag(name = "project API", description = "프로젝트 생성/조회/수정/삭제를 위한 API입니다.")
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectServiceApi projectServiceApi;

    @Operation(summary = "프로젝트 생성", description = "신규 프로젝트를 생성합니다, MANAGER, WORKER 모두 프로젝트를 생성할 수 있습니다.",
            // JWT 인증이 필요한 API임을 명시
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "프로젝트 생성 성공, 생성된 프로젝트의 PK 값이 반환됩니다. 상세조회시 사용", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ProjectCreateResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음 (MANAGER 역할 아님)", content = @Content)
    })
    @PostMapping
    public ResponseEntity<ProjectCreateResponse> createProject(
            @Parameter(description = "생성할 프로젝트의 정보", required = true) @Valid @RequestBody ProjectCreateRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectServiceApi.createProject(request, loginUser.getName()));
    }

    @Operation(summary = "프로젝트 상세 조회", description = "상세 프로젝트 내역을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상세 프로젝트 조회 성공", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ProjectDetailResponse.class))),
    })
    @GetMapping(value = "/{projectId}")
    public ResponseEntity<ProjectDetailResponse> viewDetailProject(
            @Parameter(description = "상세조회할 프로젝트 번호", required = true) @PathVariable("projectId") long projectId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectServiceApi.getDetailProject(projectId, loginUser.getName()));
    }

    @Operation(summary = "프로젝트 수정", description = "프로젝트 정보를 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프로젝트 정보 수정 성공", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ProjectDetailResponse.class))),
    })
    @PatchMapping("/{projectId}")
    public ResponseEntity<ProjectDetailResponse> updateProject(
            @Parameter(description = "업데이트할 프로젝트 번호", required = true) @PathVariable("projectId") long projectId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(description = "업데이트할 프로젝트 정보") @Valid @RequestBody ProjectUpdateRequest request) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectServiceApi.updateProject(projectId, loginUser.getName(), request));
    }

    @Operation(summary = "프로젝트 삭제", description = "프로젝트 정보를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "프로젝트 정보 삭제 성공"),
    })
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> removeProject(
            @Parameter(description = "업데이트할 프로젝트 번호", required = true) @PathVariable("projectId") long projectId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser) {
        projectServiceApi.closeProject(projectId, loginUser.getName());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Operation(summary = "프로젝트 조회", description = "페이지네이션 기반 프로젝트 리스트를 조회합니다")
    @GetMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프로젝트 조회 성공. 프로젝트 리스트가 반환됩니다.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, array = @ArraySchema(schema = @Schema(implementation = ProjectListResponse.class)))),
    })
    public ResponseEntity<ProjectListResponseWithPaging> listAllProject(@RequestParam(name = "page", defaultValue = "1") int page,
                                                                          @RequestParam(name = "offset", defaultValue = "6") int offset) {

        return ResponseEntity.status(HttpStatus.OK).body(projectServiceApi.getProjectInfoWithPaging(page-1, offset));
    }

    @Operation(summary = "프로젝트 연도별 조회", description = "연도별로 프로젝트 리스트를 조회합니다")
    @GetMapping("/groupByYear")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프로젝트 조회 성공. 연도별 프로젝트 리스트가 반환됩니다.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, array = @ArraySchema(schema = @Schema(implementation = ProjectGroupByYearResponse.class)))),
    })
    public ResponseEntity<List<ProjectGroupByYearResponse>> getProjectsGroupByYear() {
        return ResponseEntity.status(HttpStatus.OK).body(projectServiceApi.getProjectsGroupByYear());
    }

}
