package kr.co.wise.office.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.wise.office.domain.member.dto.LoginRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * JSON Login Authentication Custom Filter
 */
@Slf4j
public class CustomEmailPasswordFilter extends AbstractAuthenticationProcessingFilter {

    private static final String HTTP_METHOD = HttpMethod.POST.name();
    private static final String LOGIN_URI = "/api/members/login";
    private static final String LOGIN_CONTENT_TYPE = MediaType.APPLICATION_JSON_VALUE;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CustomEmailPasswordFilter(AuthenticationManager authenticationManager) {
        super(new AntPathRequestMatcher(LOGIN_URI, HTTP_METHOD));
        setAuthenticationManager(authenticationManager);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        if (request.getContentType() == null || !request.getContentType().equals(LOGIN_CONTENT_TYPE)) {
            throw new AuthenticationServiceException("지원하지 않는 로그인 HTTP Method : " + request.getContentType());
        }

        String messageBody = StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8);
        LoginRequest loginRequest = objectMapper.readValue(messageBody, LoginRequest.class);

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password());
        return this.getAuthenticationManager().authenticate(token);
    }
}
