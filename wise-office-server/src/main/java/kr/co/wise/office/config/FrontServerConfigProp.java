package kr.co.wise.office.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "front")
@Getter
@AllArgsConstructor
public class FrontServerConfigProp {
    private final String url;
    private final String port;

    public String getFrontUrl(){
        return url + ":" + port;
    }
}
