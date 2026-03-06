package kr.co.wise.office.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class WebClientConfig {

    @Bean
    @Qualifier("holidayRestClient")
    public RestClient holidayRestClient(){
        return RestClient.builder()
                .baseUrl("http://apis.data.go.kr")
                .build();
    }


}
