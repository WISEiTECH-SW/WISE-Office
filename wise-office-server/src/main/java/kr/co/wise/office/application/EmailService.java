package kr.co.wise.office.application;

import kr.co.wise.office.domain.member.dto.EmailVerificationResult;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@AllArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final Map<String, String> verificationRepository = new ConcurrentHashMap<>();
    private final Map<String, String> verified = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, LocalDateTime> repeatBlocker = new ConcurrentHashMap<>();
    private final String title = "WISE-Backoffice 이메일 인증 번호";
    private final String NOT_FOUND = "NOTFOUND";

    private static final int BLOCK_DURATION_SECOND = 60; // 중복 요청 방지 시간

    public void sendCode(String email) {
        sendEmailWithCode(email, "[WISE-BackOffice] 회원가입 인증번호", "인증 번호 : ");
    }

    public void findPasswordCode(String email) {
        sendEmailWithCode(email, "[WISE-BackOffice] 로그인 비밀번호 찾기", "인증 번호 : ");
    }

    private void sendEmailWithCode(String email, String title, String contentPrefix) {
        validationRepeat(email);
        String code = createCode();
        verificationRepository.put(email, code);

        try {
            mailSender.send(createMessage(email, title, contentPrefix + code));
        } catch (RuntimeException e) {
            log.error("EmailService.findPasswordCode exception : {}, {}, {}, {}", email, title, code, e.getMessage());
            throw new ApplicationRuntimeException(ErrorMessage.INTERNAL_ERROR);
        }
    }

    public EmailVerificationResult verificationCode(String email, String code) {
        String savedCode = verificationRepository.getOrDefault(email, NOT_FOUND);
        if (savedCode.equals(NOT_FOUND) || !savedCode.equals(code)) {
            log.error("EmailService.verificationCode exception : {}, {}, {}", email, savedCode, code);
            return EmailVerificationResult.of(false);
        }
        verificationRepository.remove(email);
        String successToken = createCode();
        verified.put(successToken, email);
        return EmailVerificationResult.from(true, successToken);
    }

    public String verificationSuccessToken(String token) {
        if (verified.get(token) == null) {
            throw new ApplicationRuntimeException(ErrorMessage.REJECT_REQUEST);
        }
        String email = verified.get(token);
        verified.remove(token);
        return email;
    }

    private void validationRepeat(String email) {
        LocalDateTime nowAttemptTime = LocalDateTime.now();

        repeatBlocker.compute(email, (e, beforeAttemptTime) -> {
            if(beforeAttemptTime == null || beforeAttemptTime.plusSeconds(BLOCK_DURATION_SECOND).isBefore(nowAttemptTime)) {
                return nowAttemptTime;
            }else{
                throw new ApplicationRuntimeException(ErrorMessage.REPEATED_CALL);
            }
        });
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
}
