package kr.co.wise.office.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import kr.co.wise.office.api.dto.minutes.MinutesDetailResponse;
import kr.co.wise.office.api.dto.proposal_attendant.PossibleAttendantsResponse;
import kr.co.wise.office.application.ProposalAttendantsServiceApi;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProposalAttendantsController {

    private final ProposalAttendantsServiceApi proposalAttendantsServiceApi;

    @GetMapping("/api/projects/{projectId}/attendants")
    @Operation(summary = "참여 가능 인원 조회", description = "회의에 참석 가능한 인원을 조회합니다.",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "가능 인원 조회 canAttend=true : 참여 가능",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = MinutesDetailResponse.class))
            )
    })
    public List<PossibleAttendantsResponse> getPossibleAttendantsList(
            @PathVariable(name = "projectId") long projectId,
            @RequestParam(name = "minutes-date") LocalDate minutesDate
    ) {

        return proposalAttendantsServiceApi.findPossibleAttendants(projectId, minutesDate);
    }



}
