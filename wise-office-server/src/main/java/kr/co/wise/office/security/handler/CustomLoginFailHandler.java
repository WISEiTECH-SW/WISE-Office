package kr.co.wise.office.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.dto.ErrorResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;

@Component
@Qualifier("customLoginFailHandler")
@AllArgsConstructor
@Slf4j
public class CustomLoginFailHandler implements AuthenticationFailureHandler {

    private ObjectMapper objectMapper;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {

        ErrorResponse errorResponse;

        if (exception.getMessage().equals(ErrorMessage.NOT_FOUND_MEMBER.getMessage())) {
            errorResponse = ErrorResponse.of(HttpStatus.UNAUTHORIZED.value(), exception.getMessage(), Collections.EMPTY_MAP);
        } else {
            errorResponse = ErrorResponse.of(HttpStatus.UNAUTHORIZED.value(), ErrorMessage.INVALID_MEMBER.getMessage(), Collections.EMPTY_MAP);
        }

        String body = objectMapper.writeValueAsString(errorResponse);
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(body);
    }
}
