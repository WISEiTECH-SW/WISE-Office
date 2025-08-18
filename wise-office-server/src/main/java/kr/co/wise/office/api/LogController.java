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
import kr.co.wise.office.application.LogServiceApi;
import kr.co.wise.office.domain.Log.dto.LogCreateRequest;
import kr.co.wise.office.domain.Log.dto.LogCreateResponse;
import kr.co.wise.office.domain.Log.dto.LogDetailResponse;
import kr.co.wise.office.domain.Log.dto.LogListResponse;
import kr.co.wise.office.domain.Project.dto.ProjectCreateResponse;
import kr.co.wise.office.domain.member.dto.CustomOAuthUser;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Tag(name = "Log", description = "로그 CRUD API 명세입니다.")
@RequestMapping("/api/v1/logs")
public class LogController {

    private final LogServiceApi logServiceApi;

    @Operation(summary = "로그 리스트 조회", description = "특정 프로젝트의 로그 리스트를 조회합니다 PM 혹은 ADMIN 유저인 경우 전체 로그를 수정할 수 있습니다. (canModify=true), 작성자는 본인의 로그만 수정할 수 있습니다.")
    @GetMapping("/{projectId}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프로젝트 리스트가 반환됩니다.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            array = @ArraySchema(schema = @Schema(implementation = LogListResponse.class))
                    )),
    })
    public ResponseEntity<List<LogListResponse>> listAllLogs(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @PathVariable(value = "projectId") long projectId) {

        List<LogListResponse> responses = logServiceApi.getAllLogs(projectId, loginUser.getName());
        return ResponseEntity.status(HttpStatus.OK).body(responses);
    }


    @Operation(summary = "로그 생성", description = "로그를 생성합니다",
            // JWT 인증이 필요한 API임을 명시
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "로그 생성 성공, 생성된 log Id 값 반환",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ProjectCreateResponse.class))),
    })
    @PostMapping("/{projectId}")
    public ResponseEntity<LogCreateResponse> createLog(@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
                                                       @PathVariable(value = "projectId") long projectId,
                                                       @RequestBody LogCreateRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(new LogCreateResponse(logServiceApi.createLog(loginUser.getName(), projectId, request)));
    }


    @Operation(summary = "로그 상세 조회 ", description = "로그 상세 내역을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그 상세 내역 조회 성공",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = LogDetailResponse.class))),
    })
    @GetMapping("/{projectId}/{logId}")
    public ResponseEntity<LogDetailResponse> viewDetailLogs(
            @PathVariable(value = "projectId") long projectId,
            @PathVariable(value = "logId") long logId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser) {

        LogDetailResponse detailLogs = logServiceApi.getDetailLogs(logId, projectId, loginUser.getName());
        return ResponseEntity.status(HttpStatus.OK).body(detailLogs);
    }

}
