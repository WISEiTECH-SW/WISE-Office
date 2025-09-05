package kr.co.wise.office.application;

import kr.co.wise.office.domain.member.dto.EmailVerificationResult;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatCode;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
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

    @Test
    @DisplayName("이메일 인증 실패 - 1분이내 재요청 차단")
    void block_repeat_request_during_5second() {
        emailService.sendCode("test@example.com");

        assertThatThrownBy(() -> emailService.sendCode("test@example.com"))
                .isInstanceOf(ApplicationRuntimeException.class)
                .extracting("errorMessage")
                .extracting("message")
                .isEqualTo(ErrorMessage.REPEATED_CALL.getMessage());
    }

    @Test
    @DisplayName("이메일 인증 성공 - 1분 이후의 요청은 정상동작")
    void accept_request_after_5second() throws InterruptedException {
        emailService.sendCode("test@example.com");

        Thread.sleep( 60001L);

        assertThatCode(() -> emailService.sendCode("test@example.com"))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("이메일 인증 성공 - 동시 요청시 하나만 허용")
    void accept_request_ony_one() throws InterruptedException {
        int threadCount = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);

        List<Future<Boolean>> results = new ArrayList<>();

        for (int i = 0; i < threadCount; i++) {
            results.add(executor.submit(() -> {
                try {
                    emailService.sendCode("test@example.com");
                    return true; // 성공
                } catch (ApplicationRuntimeException e) {
                    return false; // 차단
                } finally {
                    latch.countDown();
                }
            }));
        }

        latch.await();

        long successCount = results.stream()
                .map(f -> {
                    try { return f.get(); }
                    catch (Exception e) { return false; }
                })
                .filter(r -> r)
                .count();

        executor.shutdown();
        assertThat(successCount).isEqualTo(1);
    }
}
