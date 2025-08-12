package kr.co.wise.office.domain.member.dto;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import kr.co.wise.office.domain.member.entity.MemberEntity;

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