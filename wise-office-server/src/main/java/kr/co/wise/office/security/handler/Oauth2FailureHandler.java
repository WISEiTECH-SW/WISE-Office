package kr.co.wise.office.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 *  OAuth2 로그인 중 실패 및 취소시 실행되는 로직
 */
@Component
public class Oauth2FailureHandler implements AuthenticationFailureHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {

        String errorMessage = URLEncoder.encode("OAuth2 로그인에 실패했습니다. 잠시후 다시 시도해주세요.", StandardCharsets.UTF_8);
        String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/login_failure") // Changed to a generic callback route
                .queryParam("message", errorMessage)
                .build().toUriString();

        response.sendRedirect(redirectUrl);
    }
}
