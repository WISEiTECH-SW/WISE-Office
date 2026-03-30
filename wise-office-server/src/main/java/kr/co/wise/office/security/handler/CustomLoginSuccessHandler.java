package kr.co.wise.office.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.wise.office.domain.member.dto.LoginResponse;
import kr.co.wise.office.util.CookieUtils;
import kr.co.wise.office.util.JWTUtil;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@Qualifier("customLoginSuccessHandler")
@AllArgsConstructor
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler  {

    private final ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String email = (String) authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        String token = JWTUtil.createJWT(email, role);

        Cookie cookie = CookieUtils.createCookie("jwt", token);
        LoginResponse loginResponse = new LoginResponse(LocalDateTime.now().plusSeconds(CookieUtils.COOKIE_EXPIRATION_SECONDES));

        String body = objectMapper.writeValueAsString(loginResponse);
        response.setStatus(HttpStatus.OK.value());
        response.addCookie(cookie);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(body);
    }
}
