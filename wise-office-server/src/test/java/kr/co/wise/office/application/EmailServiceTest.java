package kr.co.wise.office.application;

import kr.co.wise.office.domain.member.dto.EmailVerificationResult;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    private final String testEmail = "test@example.com";

    @Test
    @DisplayName("이메일 인증 코드 전송 성공 테스트")
    void sendCode_Success() {
        // given
        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        // when
        emailService.sendCode(testEmail);

        // then
        // mailSender.send()가 1번 호출되었는지 검증
        verify(mailSender, times(1)).send(messageCaptor.capture());

        SimpleMailMessage sentMessage = messageCaptor.getValue();
        assertThat(sentMessage.getTo()).contains(testEmail);
        assertThat(sentMessage.getSubject()).isEqualTo("WISE-Backoffice 이메일 인증 번호");
        assertThat(sentMessage.getText()).isNotNull();
        assertThat(sentMessage.getText().length()).isEqualTo(6);
    }

    @Test
    @DisplayName("이메일 인증 성공 및 인증 코드 삭제(버그 수정) 확인 테스트")
    void verificationCode_Success_And_CodeRemoved() {
        // given
        // 1. 인증 코드를 먼저 전송하여 저장소에 코드를 저장
        emailService.sendCode(testEmail);
        
        // ArgumentCaptor를 사용해 전송된 실제 코드를 가져옴
        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(messageCaptor.capture());
        String sentCode = messageCaptor.getValue().getText();

        // when
        // 2. 올바른 코드로 인증 시도
        EmailVerificationResult result = emailService.verificationCode(testEmail, sentCode);

        // then
        // 3. 첫 인증은 성공해야 함
        assertThat(result.verification()).isTrue();

        // when
        // 4. 동일한 코드로 다시 인증 시도
        EmailVerificationResult resultAfterFirstVerification = emailService.verificationCode(testEmail, sentCode);

        // then
        // 5. 코드가 삭제되었으므로 두 번째 인증은 실패해야 함
        assertThat(resultAfterFirstVerification.verification()).isFalse();
    }

    @Test
    @DisplayName("이메일 인증 실패 - 코드가 틀린 경우")
    void verificationCode_Fail_WithWrongCode() {
        // given
        emailService.sendCode(testEmail);
        String wrongCode = "123456";

        // when
        EmailVerificationResult result = emailService.verificationCode(testEmail, wrongCode);

        // then
        assertThat(result.verification()).isFalse();
    }

    @Test
    @DisplayName("이메일 인증 실패 - 존재하지 않는 이메일")
    void verificationCode_Fail_WithNonExistentEmail() {
        // given
        String nonExistentEmail = "nonexistent@example.com";
        String anyCode = "abcdef";

        // when
        EmailVerificationResult result = emailService.verificationCode(nonExistentEmail, anyCode);

        // then
        assertThat(result.verification()).isFalse();
    }
}
