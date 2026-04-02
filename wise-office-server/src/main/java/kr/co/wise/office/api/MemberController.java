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
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import kr.co.wise.office.application.EmailService;
import kr.co.wise.office.application.ImageService;
import kr.co.wise.office.domain.member.dto.*;
import kr.co.wise.office.domain.member.service.MemberService;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import kr.co.wise.office.util.CookieUtils;
import kr.co.wise.office.util.JWTUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

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

    @Operation(summary = "전체 멤버 정보 조회", description = "가입 회원, 회사 전체 인원 각각 모든 사람의 직급, 계급, 이름, PK 값을 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "멤버 정보 조회 성공", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, array = @ArraySchema(schema = @Schema(implementation = MemberListResponse.class))))
    })
    @GetMapping
    public ResponseEntity<MemberGroupedResponse> viewAllMemberInfo(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(memberService.searchAllMemberInfo(loginUser.getName()));
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

    @PostMapping(value = "/signup", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @Operation(summary = "자체 회원가입", description = "이메일, 비밀번호, 이름으로 회원가입합니다.")
    public ResponseEntity<Void> signup(@Valid @RequestPart("request") SignupRequest signUpRequest,
                                       @RequestPart(value = "profile", required = false)MultipartFile profileImage) {
        log.info(signUpRequest.toString());
        String imagePath = imageService.saveImage(profileImage);
        // null로 저장하면 프론트에서 default 이미지 보여줌
        memberService.signUp(signUpRequest, null);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/extend")
    @Operation(summary = "로그인 연장", description = "로그인 시간을 30분 연장 합니다.")
    public ResponseEntity<LoginResponse> extendLogin(
            @Parameter(hidden = true) HttpServletResponse response,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser
    ) {
        String email = loginUser.getName();
        String role = loginUser.getAuthorities().iterator().next().getAuthority();

        //JWT 토큰 재발급
        String extendedJWT = JWTUtil.createJWT(email, role);
        Cookie cookie = CookieUtils.createCookie("jwt", extendedJWT);
        response.addCookie(cookie);

        return ResponseEntity.ok(new LoginResponse(LocalDateTime.now().plusSeconds(CookieUtils.COOKIE_EXPIRATION_SECONDES)));
    }

    @PostMapping("/login")
    @Operation(summary = "자체 로그인", description = "이메일, 비밀번호로 로그인하고 JWT를 발급받습니다.")
    public ResponseEntity<Void> login(@Valid @RequestBody LoginRequest loginRequest,
                                      HttpServletResponse response) throws IOException {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/emails/verification")
    @Operation(summary = "이메일 코드 전송", description = "인증번호를 발급받을 이메일을 입력합니다.")
    public ResponseEntity<Void> sendMessage(
            @Parameter(description = "사용할 이메일") @RequestBody VerificationCodeCreationRequest request) {
        validateEmail(request.email());
        memberService.checkAlreadySignUp(request.email());
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
            @Parameter(description = "인증 요청한 email") @NotBlank(message = "{email.blank}") @Email(message = "{login.email}") @Valid @RequestParam("email") String email,
            @Parameter(description = "전달받은 code 6자리") @NotBlank(message = "{notBlank}")  @Valid @RequestParam("code") String code) {
        validateEmail(email);
        memberService.checkAlreadySignUp(email);
        EmailVerificationResult emailVerificationResult = emailService.verificationCode(email, code);
        return ResponseEntity.status(HttpStatus.OK).body(emailVerificationResult);
    }

    @PatchMapping("/images")
    @Operation(summary = "프로필 사진 수정", description = "프로필 사진을 수정합니다.")
    public ResponseEntity<MemberImageUpdateResponse> updateProfile(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(description = "업데이트할 이미지 이름, key = profile로 전달") @RequestPart("profile") MultipartFile image) {
        String savedImageName = imageService.saveImage(image);
        memberService.updateMemberProfile(savedImageName, loginUser.getName());
        return ResponseEntity.status(HttpStatus.OK).body(new MemberImageUpdateResponse(savedImageName));
    }

    @PatchMapping("/account")
    @Operation(summary = "계정 정보 수정", description = "부서, 직급, 입사일을 수정합니다. 사용자가 변경된 값만 업데이트됩니다.")
    public ResponseEntity<Void> updateAccountInfo(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @RequestBody @Valid MemberUpdateRequest request) {

        memberService.updateMember(loginUser.getName(), request);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PatchMapping("/password")
    @Operation(summary = "비밀번호 변경", description = "비밀번호를 변경합니다.")
    public ResponseEntity<Void> updatePassword(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @RequestBody @Valid ChangePasswordRequest request
    ) {
        memberService.changePassword(loginUser.getName(), request.password(), request.passwordCheck());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/hire-date")
    public ResponseEntity<HireDateResponse> getHireDateLoginUser(
    @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser){
        HireDateResponse response = memberService.getHireDate(loginUser.getName());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/email/find-password")
    @Operation(summary = "비밀번호 찾기")
    public ResponseEntity<Void> findPassword(
            @Parameter(description = "사용할 이메일") @RequestBody VerificationCodeCreationRequest request
    ) {
        validateEmail(request.email());
        //기존에 가입한 계정인지 검사
        memberService.checkSignUp(request.email());

        emailService.findPasswordCode(request.email());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/email/find-password/verification")
    @Operation(summary = "비밀번호 찾기 검증")
    public ResponseEntity<EmailVerificationResult> findPasswordVerification(
            @Parameter(description = "인증 요청한 email") @NotBlank(message = "{email.blank}") @Email(message = "{login.email}")
            @Valid @RequestParam("email") String email,
            @Parameter(description = "전달받은 code 6자리") @NotBlank(message = "{notBlank}")  @Valid @RequestParam("code") String code
    ) {
        validateEmail(email);
        memberService.checkSignUp(email);
        EmailVerificationResult emailVerificationResult = emailService.verificationCode(email, code);
        return ResponseEntity.status(HttpStatus.OK).body(emailVerificationResult);
    }

    @PatchMapping("/email/find-password/verification")
    @Operation(summary = "비밀번호 초기화")
    public ResponseEntity<Void> resetPassword(
            @Parameter(description = "비밀번호 초기화") @RequestBody ResetPasswordRequest request
    ) {
        String email = emailService.verificationSuccessToken(request.successToken());
        memberService.changePassword(email, request.password(), request.passwordCheck());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", "");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setSecure(false);
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    private void validateEmail(String email) {
        if (allowDomain.equals("all")) {
            return;
        }

        if (!email.endsWith(allowDomain)) {
            throw new ApplicationRuntimeException(ErrorMessage.FORBIDDEN_SIGNUP);
        }
    }

}
