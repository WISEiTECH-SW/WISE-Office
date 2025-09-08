package kr.co.wise.office.config;

import kr.co.wise.office.security.filter.JWTFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
@Slf4j
public class SecurityConfig {

    private final AuthenticationSuccessHandler oauth2SuccessHandler;
    private final AuthenticationFailureHandler oauth2FailureHandler;
    private final AccessDeniedHandler customAccessDeniedHandler;
    private final FrontServerConfigProp frontConfig;

    public SecurityConfig(AuthenticationSuccessHandler oauth2SuccessHandler,
                          AuthenticationFailureHandler oauth2FailureHandler,
                          AccessDeniedHandler customAccessDeniedHandler,
                          FrontServerConfigProp frontConfig) {
        this.oauth2SuccessHandler = oauth2SuccessHandler;
        this.oauth2FailureHandler = oauth2FailureHandler;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
        this.frontConfig = frontConfig;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http.csrf(AbstractHttpConfigurer::disable);
        http.formLogin(AbstractHttpConfigurer::disable);
        http.httpBasic(AbstractHttpConfigurer::disable);
        http.cors(cors -> cors.configurationSource(corsConfiguration()));

//        http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/login/oauth2/code/google", "/oauth2/**", "/health", "/swagger-ui/**",
                        "/v3/api-docs/**", "/api/members/signup", "/api/members/login", "/api/v2/projects", "/api/members/me",
                        "/api/members/emails/verification",
                        "/images/**").permitAll()
                .anyRequest().authenticated());

        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.oauth2Login(
                oauth2 -> oauth2.successHandler(oauth2SuccessHandler).failureHandler(oauth2FailureHandler)
                        .permitAll());

        http.exceptionHandling(exceptionConfig ->
                exceptionConfig.accessDeniedHandler(customAccessDeniedHandler));

        //http.addFilterBefore(new LoginFilter(authenticationManager(authenticationConfiguration)), UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(new JWTFilter(), LogoutFilter.class);

        return http.build();
    }

    // cors 설정
    @Bean
    public CorsConfigurationSource corsConfiguration(){
        CorsConfiguration corsConfig = new CorsConfiguration();
        final String frontUrl = frontConfig.getFrontUrl();
        log.info("front url = {}", frontUrl);

        corsConfig.setAllowedMethods(
                List.of(HttpMethod.GET.name(), HttpMethod.POST.name(),
                        HttpMethod.DELETE.name(), HttpMethod.PATCH.name(),
                        HttpMethod.PUT.name(), HttpMethod.OPTIONS.name()));
        corsConfig.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        corsConfig.setAllowedOriginPatterns(List.of(frontUrl));
        corsConfig.setAllowCredentials(true); // 쿠키

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return source;
    }

}
