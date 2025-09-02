package kr.co.wise.office.application;

import kr.co.wise.office.domain.member.dto.EmailVerificationResult;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@AllArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final ConcurrentHashMap<String, String> verificationRepository = new ConcurrentHashMap<>();
    private final String title = "WISE-Backoffice 이메일 인증 번호";
    private final String NOT_FOUND = "NOTFOUND";

    public void sendCode(String email) {
        String title = "WISE-Backoffice 이메일 인증 번호";
        String code = createCode();
        verificationRepository.put(email, code);
        try {
            mailSender.send(createMessage(email, title, code));
        } catch (RuntimeException e) {
            log.info("EmailService.sendEmail exception : {}, {}, {}", email, title, code);
            throw new ApplicationRuntimeException(ErrorMessage.INTERNAL_ERROR);
        }
    }

    public EmailVerificationResult verificationCode(String email, String code) {
        String savedCode = verificationRepository.getOrDefault(email, NOT_FOUND);
        if (savedCode.equals(NOT_FOUND) || !savedCode.equals(code)) {
            log.debug("EmailService.verificationCode exception : {}, {}, {}",
                    email, savedCode, code);
            return EmailVerificationResult.of(false);
        }
        verificationRepository.remove(savedCode);
        return EmailVerificationResult.of(true);
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
