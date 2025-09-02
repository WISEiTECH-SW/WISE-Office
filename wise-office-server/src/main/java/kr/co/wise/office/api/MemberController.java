package kr.co.wise.office.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import kr.co.wise.office.domain.member.dto.*;
import kr.co.wise.office.domain.member.service.MemberService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Tag(name = "member", description = "회원 조회 관련 API 입니다.")
@AllArgsConstructor
@RestController
@RequestMapping("/api/members")
@Slf4j
public class MemberController {

        private final MemberService memberService;

        @Operation(summary = "전체 멤버 정보 조회", description = "모든 회원의 직급, 계급, 이름, PK 값을 반환합니다, 현재 로그인 중인 사람은 반환되지 않습니다.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "멤버 정보 조회 성공", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, array = @ArraySchema(schema = @Schema(implementation = MemberListResponse.class))))
        })
        @GetMapping
        public ResponseEntity<List<MemberListResponse>> viewAllMemberInfo(
                        @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser) {
                return ResponseEntity.status(HttpStatus.OK)
                                .body(memberService.searchAllMemberInfo(loginUser.getName()));
        }

        @Operation(summary = "매니저 권한 확인", description = "현재 로그인한 사용자가 매니저 권한(ROLE_MANAGER)을 가지고 있는지 여부를 반환합니다.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "body의 isManager 값이 true면 Manager, false면 WORKER", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = IsManagerResponse.class))),
        })
        @GetMapping("/is-manager")
        public ResponseEntity<IsManagerResponse> checkIsManager() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                GrantedAuthority grantedAuthority = authentication.getAuthorities().stream().toList().get(0);
                boolean isManager = grantedAuthority.getAuthority().equals("ROLE_MANAGER");
                return ResponseEntity.status(HttpStatus.OK).body(new IsManagerResponse(isManager));
        }

        @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
        @Operation(summary = "마이페이지 정보 조회", description = "현재 로그인한 사용자의 세부 정보를 반환합니다.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "마이페이지 정보 조회 성공", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = MyAccountResponse.class))),
        })
        @GetMapping("/me")
        public ResponseEntity<MyAccountResponse> viewMyAccount(
                        @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser) {
                log.info("=== 로그인된 사용자 정보: " + memberService.getMyAccountInfo(loginUser.getName()));
                return ResponseEntity.status(HttpStatus.OK).body(memberService.getMyAccountInfo(loginUser.getName()));
        }

        @Operation(summary = "직급 및 소속 변경 API", description = "직급과 소속을 변경합니다.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "직급 소속 변경 성공", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = MemberPositionUpdateResponse.class))),
        })
        @PatchMapping
        public ResponseEntity<MemberPositionUpdateResponse> updateInfo(
                        @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
                        @Parameter(description = "업데이트 할 직급 및 소속") @Valid @RequestBody MemberPositionUpdateRequest request) {

                memberService.updateMemberPosition(request, loginUser.getName());
                return ResponseEntity.status(HttpStatus.OK)
                                .body(new MemberPositionUpdateResponse(request.team(), request.rank()));
        }

        @PostMapping("/signup")
        @Operation(summary = "자체 회원가입", description = "이메일, 비밀번호, 이름으로 회원가입합니다.")
        public ResponseEntity<Void> signup(@RequestBody SingUpRequest signUpRequest) {
            log.info(signUpRequest.toString());
            memberService.signUp(signUpRequest);
            return ResponseEntity.ok().build();
        }

        @PostMapping("/login")
        @Operation(summary = "자체 로그인", description = "이메일, 비밀번호로 로그인하고 JWT를 발급받습니다.")
        public ResponseEntity<Void> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) throws IOException {
            String token = memberService.login(loginRequest);

            log.info("생성된 token = {}", token);

            // 응답
            Cookie cookie = new Cookie("jwt", token);
            //cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(600);

            response.addCookie(cookie);
            response.sendRedirect("http://localhost:3000/");
            return ResponseEntity.ok().build();
        }

}
