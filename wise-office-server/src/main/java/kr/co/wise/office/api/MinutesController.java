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
import kr.co.wise.office.api.dto.minutes.*;
import kr.co.wise.office.application.MinutesServiceApi;
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
@Tag(name = "minutes", description = "회의록 CRUD API 명세입니다.")
@RequestMapping("/api/projects/{projectId}/minutes")
public class MinutesController {

    private final MinutesServiceApi minutesServiceApi;

    @GetMapping
    @Operation(summary = "회의록 목록 조회", description = "프로젝트에서 작성된 회의록 목록을 조회합니다. 해당 프로젝트에 참여하지 않아도 조회 가능",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회의록 리스트 반환",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            array = @ArraySchema(schema = @Schema(implementation = MinutesListResponse.class))
                    )),
    })
    public ResponseEntity<List<MinutesListResponse>> getMinutesList(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(description = "회의록을 조회할 프로젝트 번호(pk값)") @PathVariable(value = "projectId") long projectId
    ) {
        return ResponseEntity.ok(minutesServiceApi.getMinutesBriefInfo(projectId, loginUser.getName()));
    }


    @PostMapping
    @Operation(summary = "회의록 생성", description = "회의록을 작성합니다.",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "회의록 작성 성공",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = MinutesDetailResponse.class))),
    })
    public ResponseEntity<MinutesDetailResponse> createMinutes(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(description = "회의록을 생성할 프로젝트 번호") @PathVariable(value = "projectId") long projectId,
            @Parameter(description = "생성할 회의록 세부 내용") @Valid @RequestBody MinutesCreateRequest request
        ) {

        return ResponseEntity.status(HttpStatus.CREATED).body(minutesServiceApi.createMinutes(projectId, loginUser.getName(), request));
    }

    @GetMapping("/{minutesId}")
    @Operation(summary = "회의록 상세 조회", description = "특정 회의록을 상세 조회합니다. 해당 프로젝트에 참여하지 않아도 조회 가능",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "작성된 회의록 정보 반환",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = MinutesDetailResponse.class))
                    )
    })
    public ResponseEntity<MinutesDetailResponse> getMinutesDetail(
            @Parameter(description = "회의록을 조회할 프로젝트 번호(pk값)") @PathVariable(value = "projectId") long projectId,
            @Parameter(description = "상세조회할 회의록 번호") @PathVariable(value = "minutesId") long minutesId
    ) {
        return ResponseEntity.ok(minutesServiceApi.getMinutesDetailInfo(minutesId, projectId));
    }


    /**
     * 회의록 업데이트 API
     * 해당 회의록 업데이트시 자등으로
     * 품의서의 내용의 일부(회의 일자, 회의 목적)이 업데이트 됩니다.
     */
    @PatchMapping("/{minutesId}")
    @Operation(summary = "회의록 수정", description = "회의록을 수정합니다.",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "수정된 회의록 데이터 전달",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = MinutesUpdateResponse.class))),
    })
    public ResponseEntity<MinutesDetailResponse> updateMinutes(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(description = "회의록을 업데이트할 프로젝트 번호") @PathVariable(value = "projectId") long projectId,
            @Parameter(description = "업데이트할 회의록 번호") @PathVariable(value = "minutesId") long minutesId,
            @Parameter(description = "생성할 회의록 세부 내용") @RequestBody MinutesUpdateRequest request
    ) {

        return ResponseEntity.status(HttpStatus.CREATED).body(minutesServiceApi.updateMinutes(projectId, loginUser.getName(), minutesId, request));
    }


    /**
     * 회의록 삭제 API
     * 해당 회의록 삭제시 자동으로 품의서도 삭제됩니다.
     */
    @DeleteMapping("/{minutesId}")
    @Operation(summary = "회의록 삭제", description = "회의록을 삭제합니다. 회의록 삭제시 자동으로 품의서도 삭제됩니다..",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "삭제 성공, 응답 바디 X",
                    content = @Content
            )
    })
    public ResponseEntity<Void> removeMinutes(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(description = "회의록을 삭제할 프로젝트 번호") @PathVariable(value = "projectId") long projectId,
            @Parameter(description = "삭제할 회의록 번호") @PathVariable(value = "minutesId") long minutesId
    ) {

        minutesServiceApi.removeMinutesWithApprove(projectId, loginUser.getName(), minutesId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }




}
