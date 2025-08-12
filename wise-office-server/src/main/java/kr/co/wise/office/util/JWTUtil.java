package kr.co.wise.office.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import kr.co.wise.office.config.JwtConfigProp;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {

    private static SecretKey secretKey;
    private static Long accessTokenExpiresIn;

    private final JwtConfigProp jwtProperties;

    public JWTUtil(JwtConfigProp jwtConfigProp) {
        this.jwtProperties = jwtConfigProp;
    }

    @jakarta.annotation.PostConstruct
    public void init() {
        secretKey = new SecretKeySpec(
                jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8),
                Jwts.SIG.HS256.key().build().getAlgorithm()
        );
        accessTokenExpiresIn = jwtProperties.getExpiration();
    }

    public static String getUsername(String token) {
        return getContent(token, "sub");
    }

    public static String getRole(String token) {
        return getContent(token, "role");
    }

    private static String getContent(String token, String key){
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token).getPayload().get(key, String.class);
    }

    public static String createJWT(String username, String role) {
        long now = System.currentTimeMillis();

        return Jwts.builder()
                .claim("sub", username)
                .claim("role", role)
                .claim("type", "access")
                .issuedAt(new Date(now))
                .expiration(new Date(now + accessTokenExpiresIn))
                .signWith(secretKey)
                .compact();
    }

    public static boolean isValid(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.get("type", String.class) != null;
        } catch (JwtException | IllegalArgumentException exception) {
            return false;
        }
    }
}