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
import kr.co.wise.office.domain.Log.dto.*;
import kr.co.wise.office.domain.member.dto.CustomOAuthUser;
import kr.co.wise.office.exception.dto.ErrorResponse;
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
@RequestMapping("/api/v1/{projectId}/logs")
public class LogController {

    private final LogServiceApi logServiceApi;

    @Operation(summary = "로그 리스트 조회", description = "특정 프로젝트의 로그 리스트를 조회합니다 PM 혹은 ADMIN 유저인 경우 프로젝트 내의 로그를 수정할 수 있습니다. (canModify=true), 작성자는 본인의 로그만 수정할 수 있습니다.",
            security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프로젝트 리스트가 반환됩니다.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            array = @ArraySchema(schema = @Schema(implementation = LogListResponse.class))
                    )),
            @ApiResponse(responseCode = "400", description = "조회할 로그에 속한 프로젝트에 참여하지 않은 경우",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = kr.co.wise.office.exception.dto.ErrorResponse.class)))
    })
    public ResponseEntity<List<LogListResponse>> listAllLogs(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @PathVariable(value = "projectId") long projectId) {
            @Parameter(description = "로그 조회할 프로젝트 번호(pk값)") @PathVariable(value = "projectId") long projectId) {

        List<LogListResponse> responses = logServiceApi.getAllLogs(projectId, loginUser.getName());
        return ResponseEntity.status(HttpStatus.OK).body(responses);
    }


    @Operation(summary = "로그 생성", description = "로그를 생성합니다",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "로그 생성 성공, 생성된 log Id 값 반환",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = LogCreateResponse.class))),
            @ApiResponse(responseCode = "400", description = "조회할 로그에 속한 프로젝트에 참여하지 않은 경우",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<LogCreateResponse> createLog(@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
                                                       @Parameter(description = "생성할 프로젝트 번호(pk값)")  @PathVariable(value = "projectId") long projectId,
                                                       @RequestBody LogCreateRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(new LogCreateResponse(logServiceApi.createLog(loginUser.getName(), projectId, request)));
    }


    @Operation(summary = "로그 상세 조회 ", description = "로그 상세 내역을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그 상세 내역 조회 성공",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = LogDetailResponse.class))),
    })
    @GetMapping("/{logId}")
    public ResponseEntity<LogDetailResponse> viewDetailLogs(
            @Parameter(description = "로그 조회할 프로젝트 번호(프로젝트 pk값)") @PathVariable(value = "projectId") long projectId,
            @Parameter(description = "로그 조회할 로그 번호(로그 pk값)")  @PathVariable(value = "logId") long logId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser) {

        LogDetailResponse detailLogs = logServiceApi.getDetailLog(logId, projectId, loginUser.getName());
        return ResponseEntity.status(HttpStatus.OK).body(detailLogs);
    }


    @Operation(summary = "로그 수정", description = "로그 수정 API로 수정 성공시 수정 요청한 title, content가 반환됩니다.",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그 수정 성공",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = LogUpdateResponse.class))),
            @ApiResponse(responseCode = "400", description = "수정할 로그 조회 실패",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "수정하려는 로그에 대한 권한이 없는 경우",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/{logId}")
    public ResponseEntity<LogUpdateResponse> updateLogs(
            @Parameter(description = "업데이트할 프로젝트 내 로그 번호(프로젝트 pk값)") @PathVariable(value = "projectId") long projectId,
            @Parameter(description = "업데이트할 프로젝트 내 로그 번호(로그 pk값)")  @PathVariable(value = "logId") long logId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(description = "수정되는 로그 폼")@RequestBody LogUpdateRequest request){

        LogUpdateResponse response = logServiceApi.updateLog(projectId, logId, loginUser.getName(), request);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @Operation(summary = "로그 삭제", description = "로그 삭제 API, 로그 삭제 성공시 204 No Content로 body가 반환되지 않습니다.",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "로그 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "삭제할 로그 조회 실패",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "삭제하는 로그에 대한 권한이 없는 경우",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{logId}")
    public ResponseEntity<Void> deleteLog(
            @Parameter(description = "삭제할 프로젝트 내 로그 번호(프로젝트 pk값)") @PathVariable(value = "projectId") long projectId,
            @Parameter(description = "삭제할 프로젝트 내 로그 번호(로그 pk값)")  @PathVariable(value = "logId") long logId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser){

        logServiceApi.removeLog(projectId, logId, loginUser.getName());

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }


}
