package kr.co.wise.office.domain.member.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class CustomOAuthUser implements OAuth2User {

    private final String email;
    private final Map<String, Object> attributes;
    private final Collection<? extends GrantedAuthority> authorities;


    public CustomOAuthUser(Map<String, Object> attributes, Collection<? extends GrantedAuthority> authorities, String email) {
        this.email = email;
        this.attributes = attributes;
        this.authorities = authorities;
    }


    @Override
    public Map<String, Object> getAttributes() {
       return this.attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getName() {
        return email;
    }




}