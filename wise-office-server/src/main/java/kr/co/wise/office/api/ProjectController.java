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
import kr.co.wise.office.application.ProjectServiceApi;
import kr.co.wise.office.domain.Project.dto.ProjectCreateRequest;
import kr.co.wise.office.domain.Project.dto.ProjectCreateResponse;
import kr.co.wise.office.domain.Project.dto.ProjectDetailResponse;
import kr.co.wise.office.domain.Project.dto.ProjectListResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j
@Tag(name = "프로젝트 생성 API", description = "프로젝트 생성/조회/수정/삭제를 위한 API입니다.")
@RequestMapping("/api/project")
public class ProjectController {

    private final ProjectServiceApi projectServiceApi;

    @Operation(summary = "프로젝트 조회", description = "프로젝트 리스트를 조회합니다")

    @GetMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프로젝트 조회 성공. 프로젝트 리스트가 반환됩니다.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            array = @ArraySchema(schema = @Schema(implementation = ProjectListResponse.class))
                    )),
    })
    public ResponseEntity<List<ProjectListResponse>> listAllProject() {
        return ResponseEntity.status(HttpStatus.OK).body(projectServiceApi.getAllProjectInfo());
    }


    @Operation(summary = "프로젝트 생성", description = "신규 프로젝트를 생성합니다. 'MANAGER' 권한이 있는 유저만 API 호출이 가능합니다..",
            // JWT 인증이 필요한 API임을 명시
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "프로젝트 생성 성공, 생성된 프로젝트의 PK 값이 반환됩니다. 상세조회시 사용",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ProjectCreateResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음 (MANAGER 역할 아님)", content = @Content)
    })
    @PreAuthorize("hasRole('MANAGER')") // Manager 역할만 접근 가능하도록 설정
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectCreateResponse> createProject(@Parameter(description = "생성할 프로젝트의 정보", required = true) @RequestBody ProjectCreateRequest request, // 반환 타입을 Long으로 변경
                                                               @Parameter(hidden = true) @AuthenticationPrincipal String currentUserEmail) throws IllegalAccessException {

        log.info("현재 로그인한 유져 : " + currentUserEmail);
        log.info(request.toString());
        Long projectId = projectServiceApi.createProject(request, currentUserEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ProjectCreateResponse(projectId)); // 생성된 프로젝트 ID 반환
    }

    @Operation(summary = "프로젝트 상세 조회", description = "상세 프로젝트 내역을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상세 프로젝트 조회 성공",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ProjectDetailResponse.class))),
    })
    @GetMapping(value = "/{projectId}")
    public ResponseEntity<ProjectDetailResponse> viewDetailProject(@Parameter(description = "상세조회할 프로젝트 번호", required = true) @PathVariable("projectId") long projectId,
                                                                   @Parameter(hidden = true) @AuthenticationPrincipal String currentUserEmail) {
        return ResponseEntity.status(HttpStatus.OK).body(projectServiceApi.getDetailProject(projectId, currentUserEmail));
    }
}

