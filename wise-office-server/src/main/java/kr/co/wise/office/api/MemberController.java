package kr.co.wise.office.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.wise.office.domain.member.dto.IsManagerResponse;
import kr.co.wise.office.domain.member.dto.MemberListResponse;
import kr.co.wise.office.domain.member.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Tag(name = "member", description = "회원 조회 관련 API 입니다.")
@AllArgsConstructor
@Controller
@RequestMapping("/api")
public class MemberController {

    private final MemberService memberService;

    @Operation(
            summary = "전체 멤버 정보 조회",
            description = "모든 회원의 직급, 계급, 이름, PK 값을 반환합니다, 현재 로그인 중인 사람은 반환되지 않습니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "멤버 정보 조회 성공",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                    array = @ArraySchema(schema = @Schema(implementation = MemberListResponse.class))))
    })
    @GetMapping("/members")
    public ResponseEntity<List<MemberListResponse>> viewAllMemberInfo(
            @Parameter(hidden = true) @AuthenticationPrincipal String currentUserEmail
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(memberService.searchAllMemberInfo(currentUserEmail));
    }

    @Operation(
            summary = "매니저 권한 확인",
            description = "현재 로그인한 사용자가 매니저 권한(ROLE_MANAGER)을 가지고 있는지 여부를 반환합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "body의 isManager 값이 true면 Manager, false면 WORKER",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = IsManagerResponse.class))
            ),
    })
    @GetMapping("is-manager")
    public ResponseEntity<IsManagerResponse> checkIsManager() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        GrantedAuthority grantedAuthority = authentication.getAuthorities().stream().toList().get(0);
        boolean isManager = grantedAuthority.getAuthority().equals("ROLE_MANAGER");
        return ResponseEntity.status(HttpStatus.OK).body(new IsManagerResponse(isManager));
    }


}
