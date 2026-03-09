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
import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.api.dto.minutes.MinutesCreateResponse;
import kr.co.wise.office.api.dto.minutes.MinutesDetailResponse;
import kr.co.wise.office.api.dto.minutes.MinutesListResponse;
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
    @Operation(summary = "회의록 목록 조회", description = "프로젝트에서 작성된 회의록 목록을 조회합니다.",
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
                            schema = @Schema(implementation = MinutesCreateResponse.class))),
    })
    public ResponseEntity<MinutesDetailResponse> createMinutes(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(description = "회의록을 생성할 프로젝트 번호") @PathVariable(value = "projectId") long projectId,
            @Parameter(description = "생성할 회의록 세부 내용") @Valid @RequestBody MinutesCreateRequest request
        ) {

        return ResponseEntity.status(HttpStatus.CREATED).body(minutesServiceApi.createMinutes(projectId, loginUser.getName(), request));
    }

    @GetMapping("/{minutesId}")
    @Operation(summary = "회의록 상세 조회", description = "특정 회의록을 상세 조회합니다.",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "작성된 회의록 정보 반환",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = MinutesDetailResponse.class))
                    )
    })
    public ResponseEntity<MinutesDetailResponse> getMinutesDetail(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(description = "회의록을 조회할 프로젝트 번호(pk값)") @PathVariable(value = "projectId") long projectId,
            @Parameter(description = "상세조회할 회의록 번호") @PathVariable(value = "minutesId") long minutesId
    ) {
        return ResponseEntity.ok(minutesServiceApi.getMinutesDetailInfo(projectId, minutesId, loginUser.getName()));
    }

}
