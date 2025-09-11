package kr.co.wise.office.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.wise.office.application.ProjectServiceApiV3;
import kr.co.wise.office.domain.Project.dto.ProjectListResponse;
import kr.co.wise.office.domain.Project.dto.ProjectListResponseWithPaging;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@Slf4j
@Tag(name = "project API V3", description = "프로젝트 페이지네이션을 위한 api입니다.")
@RequestMapping("/api/v3/projects")
public class ProjectControllerV3 {

    private final ProjectServiceApiV3 projectServiceApiV3;

    @Operation(summary = "프로젝트 조회 V3", description = "페이지네이션 기반 프로젝트 리스트를 조회합니다")
    @GetMapping
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프로젝트 조회 성공. 프로젝트 리스트가 반환됩니다.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, array = @ArraySchema(schema = @Schema(implementation = ProjectListResponse.class)))),
    })
    public ResponseEntity<ProjectListResponseWithPaging> listAllProjectV2(@RequestParam(name = "page", defaultValue = "1") int page,
                                                                          @RequestParam(name = "offset", defaultValue = "6") int offset) {

        return ResponseEntity.status(HttpStatus.OK).body(projectServiceApiV3.getProjectInfoWithPaging(page-1, offset));
    }

}
