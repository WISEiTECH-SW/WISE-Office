package kr.co.wise.office.config;

import kr.co.wise.office.security.filter.CustomEmailPasswordFilter;
import kr.co.wise.office.security.filter.JWTFilter;
import kr.co.wise.office.security.handler.CustomAuthenticationEntryPoint;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
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
@Slf4j
public class SecurityConfig {

    private final AuthenticationSuccessHandler oauth2SuccessHandler;
    private final AuthenticationFailureHandler oauth2FailureHandler;
    private final AuthenticationFailureHandler customLoginFailHandler;
    private final AuthenticationSuccessHandler customLoginSuccessHandler;
    private final AccessDeniedHandler customAccessDeniedHandler;
    private final FrontServerConfigProp frontConfig;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public SecurityConfig(@Qualifier("oauth2SuccessHandler") AuthenticationSuccessHandler oauth2SuccessHandler,
            @Qualifier("oauth2FailureHandler") AuthenticationFailureHandler oauth2FailureHandler,
            @Qualifier("customLoginFailHandler") AuthenticationFailureHandler customLoginFailHandler,
            @Qualifier("customLoginSuccessHandler") AuthenticationSuccessHandler customLoginSuccessHandler,
            AccessDeniedHandler customAccessDeniedHandler,
            FrontServerConfigProp frontConfig,
            CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
            AuthenticationConfiguration authenticationConfiguration,
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        this.oauth2SuccessHandler = oauth2SuccessHandler;
        this.oauth2FailureHandler = oauth2FailureHandler;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
        this.frontConfig = frontConfig;
        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
        this.authenticationConfiguration = authenticationConfiguration;
        this.customLoginSuccessHandler = customLoginSuccessHandler;
        this.customLoginFailHandler = customLoginFailHandler;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        provider.setHideUserNotFoundExceptions(false);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.formLogin(AbstractHttpConfigurer::disable);
        http.httpBasic(AbstractHttpConfigurer::disable);
        http.cors(cors -> cors.configurationSource(corsConfiguration()));

        // http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/login/oauth2/code/google", "/oauth2/**", "/health", "/swagger-ui/**",
                        "/v3/api-docs/**", "/api/members/signup", "/api/members/login", "/api/v1/projects",
                        "/api/members/emails/verification", "/swagger-ui.html", "/api/v1/projects/groupByYear",
                        "/images/**", "/github-action", "/api/members/email/find-password", "/api/members/email/find-password/verification",
                        "/api/members/email/find-password/verification")
                .permitAll()
                .anyRequest().authenticated());

        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // http.oauth2Login(
        // oauth2 -> oauth2
        // .successHandler(oauth2SuccessHandler)
        // .failureHandler(oauth2FailureHandler)
        // .permitAll());

        http.exceptionHandling(exceptionConfig -> exceptionConfig
                .accessDeniedHandler(customAccessDeniedHandler)
                .authenticationEntryPoint(customAuthenticationEntryPoint));

        // http.addFilterBefore(new
        // LoginFilter(authenticationManager(authenticationConfiguration)),
        // UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(new JWTFilter(), UsernamePasswordAuthenticationFilter.class);
        http.addFilterAt(customEmailPasswordFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CustomEmailPasswordFilter customEmailPasswordFilter() throws Exception {
        CustomEmailPasswordFilter filter = new CustomEmailPasswordFilter(
                authenticationManager(authenticationConfiguration));

        filter.setAuthenticationSuccessHandler(customLoginSuccessHandler);
        filter.setAuthenticationFailureHandler(customLoginFailHandler);
        return filter;
    }

    // cors 설정
    @Bean
    public CorsConfigurationSource corsConfiguration() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        final String frontUrl = frontConfig.getFrontUrl();
        corsConfig.setAllowedMethods(
                List.of(HttpMethod.GET.name(), HttpMethod.POST.name(),
                        HttpMethod.DELETE.name(), HttpMethod.PATCH.name(),
                        HttpMethod.PUT.name(), HttpMethod.OPTIONS.name()));
        corsConfig.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        corsConfig.setAllowedOriginPatterns(List.of(frontUrl, frontConfig.getUrl()));
        corsConfig.setAllowCredentials(true); // 쿠키
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return source;
    }

}
