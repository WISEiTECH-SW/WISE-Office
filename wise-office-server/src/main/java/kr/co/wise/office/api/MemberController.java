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
import jakarta.validation.constraints.NotBlank;
import kr.co.wise.office.application.EmailService;
import kr.co.wise.office.application.ImageService;
import kr.co.wise.office.domain.member.dto.*;
import kr.co.wise.office.domain.member.service.MemberService;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "member", description = "회원 조회 관련 API 입니다.")
@RestController
@RequestMapping("/api/members")
@Slf4j
public class MemberController {

    private final MemberService memberService;
    private final EmailService emailService;
    private final String allowDomain;
    private final ImageService imageService;

    public MemberController(MemberService memberService, EmailService emailService,
                            @Value("${domain.email}") String allowDomain, ImageService imageService) {
        this.memberService = memberService;
        this.emailService = emailService;
        this.allowDomain = allowDomain;
        this.imageService = imageService;
    }

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
    public ResponseEntity<Void> signup(@Valid @RequestPart("request") SignupRequest signUpRequest,
                                       @RequestPart(value = "profile", required = false)MultipartFile profileImage) {
        log.info(signUpRequest.toString());
        String imagePath = imageService.saveImage(profileImage);
        memberService.signUp(signUpRequest, imagePath);
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

    @PostMapping("/emails/verification")
    @Operation(summary = "이메일 코드 전송", description = "인증번호를 발급받을 이메일을 입력합니다.")
    public ResponseEntity<Void> sendMessage(
            @Parameter(description = "사용할 이메일") @RequestBody VerificationCodeCreationRequest request) {
        validateEmail(request.email());
        emailService.sendCode(request.email());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/emails/verification")
    @Operation(summary = "코드 검증", description = "인증 번호를 검증합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 번호 검증 결과, true : 검증 완료, false : 검증 실패",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = EmailVerificationResult.class))),
    })
    public ResponseEntity<EmailVerificationResult> verificationCode(
            @NotBlank(message = "이메일은 빈값일 수 없습니다.") @Parameter(description = "인증 요청한 email") @RequestParam("email") String email,
            @NotBlank(message = "코드 번호는 빈 값일 수 없습니다.") @Parameter(description = "전달받은 code 6자리") @RequestParam("code") String code) {
        validateEmail(email);
        EmailVerificationResult emailVerificationResult = emailService.verificationCode(email, code);
        return ResponseEntity.status(HttpStatus.OK).body(emailVerificationResult);
    }

    @PatchMapping("/images")
    @Operation(summary = "프로필 사진 수정", description = "프로필 사진을 수정합니다.")
    public ResponseEntity<MemberUpdateResponse> updateProfile(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(description = "업데이트할 이미지 이름, key = profile로 전달") @RequestPart("profile") MultipartFile image) {
        String savedImageName = imageService.saveImage(image);
        memberService.updateMemberProfile(savedImageName, loginUser.getName());
        return ResponseEntity.status(HttpStatus.OK).body(new MemberUpdateResponse(savedImageName));
    }

    private void validateEmail(String email) {
        if (!email.endsWith(allowDomain)) {
            throw new ApplicationRuntimeException(ErrorMessage.FORBIDDEN_SIGNUP);
        }
    }
}
