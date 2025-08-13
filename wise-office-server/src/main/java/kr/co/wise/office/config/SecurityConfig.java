package kr.co.wise.office.config;

import kr.co.wise.office.security.filter.JWTFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final AuthenticationSuccessHandler oauth2SuccessHandler;
    private final AuthenticationFailureHandler oauth2FailureHandler;
    private final AccessDeniedHandler customAccessDeniedHandler;

    public SecurityConfig(AuthenticationSuccessHandler oauth2SuccessHandler, AuthenticationFailureHandler oauth2FailureHandler, AccessDeniedHandler customAccessDeniedHandler) {
        this.oauth2SuccessHandler = oauth2SuccessHandler;
        this.oauth2FailureHandler = oauth2FailureHandler;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
    }

    //auth.requestMatchers(new String[]{"/projects", "/oauth**", "/health", "/swagger-ui.html.", "/"}

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http.csrf(AbstractHttpConfigurer::disable);
        http.formLogin(AbstractHttpConfigurer::disable);
        http.httpBasic(AbstractHttpConfigurer::disable);
    
        http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED));
        http.oauth2Login(
                oauth2 -> oauth2.successHandler(oauth2SuccessHandler).failureHandler(oauth2FailureHandler)
        .permitAll());

        http.exceptionHandling(exceptionConfig ->
                exceptionConfig.accessDeniedHandler(customAccessDeniedHandler));
        http.addFilterBefore(new JWTFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // cors 설정
    @Bean
    public CorsConfigurationSource corsConfiguration(){
        CorsConfiguration corsConfig = new CorsConfiguration();

        corsConfig.setAllowedMethods(List.of("*"));
        corsConfig.setAllowedHeaders(List.of("*"));
        corsConfig.setAllowedOriginPatterns(List.of("*"));
        corsConfig.setAllowCredentials(true); // 쿠기

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return source;
    }
    
}
