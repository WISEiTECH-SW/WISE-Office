package kr.co.wise.office.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import kr.co.wise.office.application.ImageService;
import kr.co.wise.office.domain.member.dto.*;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.domain.member.repository.MemberRepository;
import kr.co.wise.office.domain.member.service.MemberService;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import kr.co.wise.office.security.WithMockCustomUser;
import org.junit.jupiter.api.*;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("자체 회원가입 및 로그인 테스트")
public class MemberControllerTest {

    @Autowired private MockMvc mockMvc;

    @Autowired private ObjectMapper objectMapper;

    @Autowired private MemberRepository memberRepository;

    @Autowired private MemberService memberService;

    @Autowired private PasswordEncoder passwordEncoder;

    @MockBean private JavaMailSender mailSender;

    @MockBean private ImageService imageService;

    private final String email = "test@wise.co.kr";
    private final String password = "password123!";
    private final String username = "testUser";

    private static final LocalDate HIRE_DATE = LocalDate.of(2020, 1, 1);

    @Nested
    @DisplayName("이메일 인증 테스트")
    class EmailVerificationTests {

        @Test
        @DisplayName("성공: 이메일 인증코드 발송 및 검증")
        void emailVerification_Success() throws Exception {
            // given
            String verificationEmail = "verification-success@wise.co.kr";
            ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
            doNothing().when(mailSender).send(messageCaptor.capture());

            // when: 인증 코드 발송 요청
            VerificationCodeCreationRequest verificationRequest = new VerificationCodeCreationRequest(verificationEmail);
            mockMvc.perform(post("/api/members/emails/verification")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(verificationRequest)))
                    .andExpect(status().isOk())
                    .andDo(print());

            // then: 발송된 메시지(인증 코드) 캡처 및 검증
            String messageText = messageCaptor.getValue().getText();
            String verificationCode = messageText.substring(messageText.lastIndexOf(":") + 1).trim();
            assertThat(verificationCode).isNotNull();
            assertThat(verificationCode.length()).isEqualTo(6);

            mockMvc.perform(get("/api/members/emails/verification")
                            .param("email", verificationEmail)
                            .param("code", verificationCode))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.verification").value(true))
                    .andDo(print());
        }

        @Test
        @DisplayName("실패: 허용되지 않은 이메일 도메인")
        void emailVerification_Fail_ForbiddenDomain() throws Exception {
            // given
            String invalidEmail = "test@gmail.com";
            VerificationCodeCreationRequest verificationRequest = new VerificationCodeCreationRequest(invalidEmail);

            // when & then
            mockMvc.perform(post("/api/members/emails/verification")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(verificationRequest)))
                    .andExpect(status().isBadRequest())
                    .andDo(print());
        }

        @Test
        @DisplayName("실패: 잘못된 인증 코드")
        void emailVerification_Fail_IncorrectCode() throws Exception {
            // given
            ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
            doNothing().when(mailSender).send(messageCaptor.capture());

            VerificationCodeCreationRequest verificationRequest = new VerificationCodeCreationRequest(email);
            mockMvc.perform(post("/api/members/emails/verification")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(verificationRequest)));

            String incorrectCode = "123456";

            // when & then
            mockMvc.perform(get("/api/members/emails/verification")
                            .param("email", email)
                            .param("code", incorrectCode))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.verification").value(false))
                    .andDo(print());
        }


        @Test
        @DisplayName("실패: 이미 가입한 이메일로 인증 시도")
        void emailVerification_Fail_useAlreadySignupEmail() throws Exception {
            // given
            MemberEntity member = MemberEntity
                    .builder().name(username).email(email).password("1234").imageUrl(null).roleType(MemberRoleType.WORKER).build();
            memberRepository.save(member);

            VerificationCodeCreationRequest verificationRequest = new VerificationCodeCreationRequest(email);
            mockMvc.perform(post("/api/members/emails/verification")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(verificationRequest)));

            // when & then
            mockMvc.perform(post("/api/members/emails/verification")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(verificationRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value(ErrorMessage.AlREADY_SIGNUP_EMAIL.getMessage()))
                    .andDo(print());
        }
    }

    @Nested
    @DisplayName("자체 회원가입 테스트")
    class SignupTests {

        @Test
        @DisplayName("성공: 회원가입 - 이미지 포함")
        void signup_Success() throws Exception {
            // given
            SignupRequest signupRequest = new SignupRequest(username, password, password, "팀", "직급", email, LocalDate.now(),"empty");
            MockMultipartFile jsonRequest = new MockMultipartFile("request", "", "application/json", objectMapper.writeValueAsBytes(signupRequest));
            MockMultipartFile uploadImage = new MockMultipartFile("profile", "test.img", MediaType.IMAGE_JPEG_VALUE, "test image content".getBytes());

            // when
            mockMvc.perform(multipart("/api/members/signup").file(jsonRequest).file(uploadImage))
                    .andExpect(status().isOk())
                    .andDo(print());

            // then
            MemberEntity savedMember = memberRepository.findByEmail(email).get();
            assertThat(savedMember.getName()).isEqualTo("testUser");
            assertThat(savedMember.getImageUrl()).isNull();
            assertThat(savedMember.getHireDate()).isEqualTo(LocalDate.now());
        }

        @Test
        @DisplayName("성공: 회원가입 - 이미지 미포함")
        void signup_notContainImage_Success() throws Exception {
            // given
            LocalDate joinDate = LocalDate.of(2024, 10, 14);
            SignupRequest signupRequest = createRequestFormWithHireDate(joinDate);
            MockMultipartFile jsonRequest = new MockMultipartFile("request", "", "application/json", objectMapper.writeValueAsBytes(signupRequest));

            // when
            mockMvc.perform(multipart("/api/members/signup").file(jsonRequest))
                    .andExpect(status().isOk())
                    .andDo(print());

            // then
            MemberEntity savedMember = memberRepository.findByEmail(email).get();
            assertThat(savedMember.getName()).isEqualTo("testUser");
            assertThat(savedMember.getImageUrl()).isNull();
            assertThat(savedMember.getHireDate()).isEqualTo(joinDate);
        }


        @Test
        @DisplayName("실패: 비밀번호 불일치")
        void signup_Fail_PasswordMismatch() throws Exception {
            // given
            String wrongPassword = "wrongPassword123!";
            SignupRequest signupRequest =  createRequestFormWithWrongPassword(wrongPassword);
            MockMultipartFile jsonRequest = new MockMultipartFile("request", "", "application/json", objectMapper.writeValueAsBytes(signupRequest));

            // when & then
            mockMvc.perform(multipart("/api/members/signup").file(jsonRequest))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.password").value("비밀번호와 비밀번호확인이 일치하지 않습니다."))
                    .andDo(print());
        }

        @Test
        @DisplayName("실패: 이미 존재하는 이메일")
        void signup_Fail_DuplicateEmail() throws Exception {
            // given: 먼저 사용자를 한 명 가입시킴
            SignupRequest signupRequest = createRequestForm();
            memberService.signUp(signupRequest, "DEFAULT_PATH");

            // when: 동일한 이메일로 다시 가입 시도
            SignupRequest duplicateSignupRequest = createRequestForm();
            MockMultipartFile jsonRequest = new MockMultipartFile("request", "", "application/json", objectMapper.writeValueAsBytes(duplicateSignupRequest));

            // then
            mockMvc.perform(multipart("/api/members/signup").file(jsonRequest))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value(ErrorMessage.AlREADY_SIGNUP_EMAIL.getMessage()))
                    .andDo(print());
        }

        @Test
        @DisplayName("성공: 입사일자 미입력")
        void signup_Fail_emptyHireDate() throws Exception {
            // given: 입사일자 미입력
            SignupRequest signupRequest = createRequestFormWithHireDate(null);
            MockMultipartFile jsonRequest = new MockMultipartFile("request", "", "application/json", objectMapper.writeValueAsBytes(signupRequest));

            // then
            mockMvc.perform(multipart("/api/members/signup").file(jsonRequest))
                    .andExpect(status().isOk())
                    .andDo(print());

            MemberEntity member = memberRepository.findByEmail(email).get();
            assertThat(member.getHireDate()).isNull();
        }
    }

    private SignupRequest createRequestFormWithWrongPassword(String wrongPassword) {
        return new SignupRequest(username, password, wrongPassword, "팀", "직급", email, LocalDate.now(), "empty");
    }

    private SignupRequest createRequestFormWithHireDate(LocalDate hireDate) {
        return new SignupRequest(username, password, password, "팀", "직급", email, hireDate, "empty");
    }

    private SignupRequest createRequestForm() {
        return createRequestFormWithHireDate(LocalDate.now());
    }

    @Nested
    @DisplayName("자체 로그인 테스트")
    class LoginTests {

        @BeforeEach
        void setUp() { //미리 회원가입 시켜둠
            MemberEntity member = MemberEntity.builder()
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .name(username)
                    .roleType(MemberRoleType.WORKER)
                    .build();
            memberRepository.save(member);
        }

        @Test
        @DisplayName("성공: 로그인")
        void login_Success() throws Exception {
            // given
            LoginRequest loginRequest = new LoginRequest(email, password);

            // when & then
            ResultActions result = mockMvc.perform(post("/api/members/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isOk())
                    .andExpect(cookie().exists("jwt"))
                    .andDo(print());
        }

        @Test
        @DisplayName("실패: 존재하지 않는 사용자")
        void login_Fail_UserNotFound() throws Exception {
            // given
            LoginRequest loginRequest = new LoginRequest("invalid@wise.co.kr", password);

            // when & then
            mockMvc.perform(post("/api/members/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").value(ErrorMessage.NOT_FOUND_MEMBER.getMessage()))
                    .andDo(print());
        }

        @Test
        @DisplayName("실패: 비밀번호 불일치")
        void login_Fail_PasswordMismatch() throws Exception {
            // given
            LoginRequest loginRequest = new LoginRequest(email, "wrongPassword");

            // when & then
            mockMvc.perform(post("/api/members/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").value(ErrorMessage.INVALID_MEMBER.getMessage()))
                    .andDo(print());
        }
    }

    @Nested
    @DisplayName("로그아웃 테스트")
    class LogoutTest{

        @Test
        @DisplayName("성공 : jwt 쿠키를 만료시키고 200 OK를 반환한다")
        @WithMockCustomUser
        void logoutTest() throws Exception {
            // when & then
            mockMvc.perform(get("/api/members/logout"))
                    .andExpect(status().isOk())
                    .andExpect(cookie().exists("jwt"))
                    .andExpect(cookie().value("jwt", ""))
                    .andExpect(cookie().maxAge("jwt", 0))
                    .andExpect(cookie().path("jwt", "/"))
                    .andDo(print());
        }
    }

    @Nested
    @DisplayName("회원 업데이트 테스트")
    class UpdateTest {

        @BeforeEach
        void setUp() { //미리 회원가입 시켜둠
            MemberEntity member = MemberEntity.builder()
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .name(username)
                    .roleType(MemberRoleType.WORKER)
                    .imageUrl("test")
                    .team("RED")
                    .rank("LEADER")
                    .build();
            memberRepository.save(member);
        }

        @Test
        @WithMockCustomUser
        @DisplayName("성공: 이미지 업데이트")
        void update_image_success() throws Exception {
            //given
            MockMultipartFile mockImage = new MockMultipartFile("profile", "update.jpg", MediaType.IMAGE_JPEG_VALUE, "update content".getBytes());
            when(imageService.saveImage(any())).thenReturn("updated-image.jpg");

            //when
            ResultActions result = mockMvc.perform(multipart(HttpMethod.PATCH, "/api/members/images").file(mockImage));

            //then
            result.andExpect(status().isOk())
                    .andDo(print());

            MemberEntity updateMember = memberRepository.findByEmail(email).get();
            assertThat(updateMember.getImageUrl()).doesNotContain("test");
        }

        @Test
        @WithMockCustomUser
        @DisplayName("실패: 이미지 형식이 아닌 파일로 업데이트 실패")
        void update_image_fail_overSize() throws Exception {
            String notSupportMediaType = MediaType.APPLICATION_PDF_VALUE;
            MockMultipartFile mockImage = new MockMultipartFile("profile", "update.jpg", notSupportMediaType, "test".getBytes());
            when(imageService.saveImage(any()))
                    .thenThrow(new ApplicationRuntimeException(ErrorMessage.REJECT_IMAGE_FORMAT));
            System.out.println("생성된 파일 크기: " + mockImage.getSize() + " bytes");

            //when
            ResultActions result = mockMvc.perform(multipart(HttpMethod.PATCH, "/api/members/images").file(mockImage));

            //then
            result.andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value(ErrorMessage.REJECT_IMAGE_FORMAT.getMessage()))
                    .andDo(print());
        }

        @Test
        @DisplayName("부서/직급 업데이트 테스트")
        @WithMockCustomUser
        void update_position() throws Exception {
            // given
            final String blueTeam = "BLUE";
            final String rank = "WORKER";
            MemberUpdateRequest updateRequest = new MemberUpdateRequest(blueTeam, rank, null);

            // when & then
            mockMvc.perform(patch("/api/members/account")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(updateRequest)))
                    .andExpect(status().isOk())
                    .andDo(print());

            MemberEntity member = memberRepository.findByEmail(email).get();
            assertThat(member.getTeam()).isEqualTo(blueTeam);
            assertThat(member.getRank()).isEqualTo(rank);
        }


        @Test
        @DisplayName("입사일자 업데이트 테스트")
        @WithMockCustomUser
        void update_hire_date_test() throws Exception {
            //given => 오늘 날짜로 입사일자 업데이트
            final LocalDate updateDate = LocalDate.now();
            final MemberUpdateRequest request = new MemberUpdateRequest(null, null, updateDate);

            //when&then
            mockMvc.perform(patch("/api/members/account")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andDo(print());

            MemberEntity member = memberRepository.findByEmail(email).get();
            assertThat(member.getHireDate()).isEqualTo(updateDate);
        }

    }


}
