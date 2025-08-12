package kr.co.wise.office.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 로그인 인증용 API Controller
 * Swagger 명세용으로 미사용
 */
@RestController
@Tag(name = "Login", description = "로그인 API 명세입니다.")
public class AuthController {


    @GetMapping("/oauth2/authorization/google")
    @Operation(summary = "Google Oauth2 로그인", description = "구글 로그인 페이지로 리다이렉션 됩니다.")
    public void redirectGoogle() {
        throw new UnsupportedOperationException("Not working Controller!");
    }

}
