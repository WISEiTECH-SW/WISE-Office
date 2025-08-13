package kr.co.wise.office.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig{

    @Bean
    public OpenAPI api(){
        return new OpenAPI()
            .info(new Info()
                    .title("백오피스 API")
                    .description("백오피스 개발 API 명세서입니다.")
                    .version("1.0.0"))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .components(new Components().addSecuritySchemes("bearerAuth", new SecurityScheme()
                    .name("bearerAuth").type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")))
            .servers(List.of(
                new Server().url("http://localhost:8080").description("테스트 개발 서버")
            ));
    }

}