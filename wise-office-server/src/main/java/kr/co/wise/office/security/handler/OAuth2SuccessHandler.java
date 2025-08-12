package kr.co.wise.office.security.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.wise.office.util.JWTUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        String email = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        //System.out.println("로그인 성공 JWT 발급 유저 정보 : " + email + "-- role : " + role);

        // JWT 발급
        String jwtToken = JWTUtil.createJWT(email, "ROLE_" + role);

        //System.out.println("발급된 JWTTOKEN : " + jwtToken);

        // 응답
        Cookie cookie = new Cookie("jwt", jwtToken);
        //cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(600);

        response.addCookie(cookie);
        response.sendRedirect("http://localhost:3000/cookie");
    }



}
