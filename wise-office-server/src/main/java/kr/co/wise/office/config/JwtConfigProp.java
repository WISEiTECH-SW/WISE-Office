package kr.co.wise.office.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtConfigProp {

    private String secret;
    private Long expiration;

    public String getSecret() {
        return secret;
    }
    public void setSecret(String secret) {
        this.secret = secret;
    }

    public Long getExpiration() {
        return expiration;
    }
    public void setExpiration(Long expiration) {
        this.expiration = expiration;
    }
}
