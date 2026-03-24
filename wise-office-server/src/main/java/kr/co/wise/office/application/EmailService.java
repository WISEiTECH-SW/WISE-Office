package kr.co.wise.office.application;

import jakarta.annotation.PreDestroy;
import kr.co.wise.office.domain.member.dto.EmailVerificationResult;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private static final int BLOCK_DURATION_MINUTES = 1; // 중복 요청 방지 시간

    private static final int VERIFICATION_VALID_MINUTES = 2; // 인증 번호 유효 시간

    private final JavaMailSender mailSender;

    private final CleanerRepository<String> verificationCodeRepository = new CleanerRepository<>(Duration.ofMinutes(VERIFICATION_VALID_MINUTES));

    private final CleanerRepository<String> verifiedEmailRepository = new CleanerRepository<>(Duration.ofMinutes(VERIFICATION_VALID_MINUTES));

    private final CleanerRepository<LocalDateTime> repeatBlocker = new CleanerRepository<>(Duration.ofMinutes(BLOCK_DURATION_MINUTES));


    public void sendCode(String email) {
        sendEmailWithCode(email, "[WISE-BackOffice] 회원가입 인증번호", "인증 번호 : ");
    }

    public void findPasswordCode(String email) {
        sendEmailWithCode(email, "[WISE-BackOffice] 로그인 비밀번호 찾기", "인증 번호 : ");
    }

    private void sendEmailWithCode(String email, String title, String contentPrefix) {
        validationRepeat(email);
        String code = createCode();
        verificationCodeRepository.put(email, code);

        try {
            mailSender.send(createMessage(email, title, contentPrefix + code));
        } catch (RuntimeException e) {
            repeatBlocker.remove(email);
            verificationCodeRepository.remove(email);
            log.error("EmailService.findPasswordCode exception : {}, {}, {}, {}", email, title, code, e.getMessage());
            throw new ApplicationRuntimeException(ErrorMessage.INTERNAL_ERROR);
        }
    }

    public EmailVerificationResult verificationCode(String email, String code) {
        String savedCode = verificationCodeRepository.get(email);
        if (savedCode == null || !savedCode.equals(code)) {
            log.error("EmailService.verificationCode exception : {}, {}, {}", email, savedCode, code);
            return EmailVerificationResult.of(false);
        }
        verificationCodeRepository.remove(email);
        String successToken = createCode();
        verifiedEmailRepository.put(successToken, email);
        return EmailVerificationResult.from(true, successToken);
    }

    public String verificationSuccessToken(String token) {
        String email = verifiedEmailRepository.remove(token);
        if (email == null) {
            throw new ApplicationRuntimeException(ErrorMessage.REJECT_REQUEST);
        }
        return email;
    }

    private void validationRepeat(String email) {
        boolean isAdded = repeatBlocker.putIfAbsent(email, LocalDateTime.now());

        if (!isAdded) {
            throw new ApplicationRuntimeException(ErrorMessage.REPEATED_CALL);
        }
    }

    private SimpleMailMessage createMessage(String targetEmail, String title, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(targetEmail);
        message.setSubject(title);
        message.setText(code);
        return message;
    }

    private String createCode() {
        int length = 6;
        return UUID.randomUUID().toString().substring(0, length);
    }

    @PreDestroy
    void shutDown() {
        verificationCodeRepository.shutDown();
        verifiedEmailRepository.shutDown();
        repeatBlocker.shutDown();
    }
}
