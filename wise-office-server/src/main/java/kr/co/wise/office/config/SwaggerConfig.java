package kr.co.wise.office.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class SwaggerConfig{

    @Bean
    public OpenAPI api(){
        return new OpenAPI()
            .info(new Info()
                    .title("백오피스 API")
                    .description("백오피스 개발 API 명세서입니다.")
                    .version("1.0.0"))
            .servers(List.of(
                new Server().url("http://localhost:8080").description("테스트 개발 서버")
            ));
    }

}