package kr.co.wise.office.domain.member.service;

import kr.co.wise.office.domain.member.dto.CustomOAuthUser;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.domain.member.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class MemberService extends DefaultOAuth2UserService {
    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    /**
     * Google-login 시도시 수행되는 로직
     * 1. 아직 회원가입 하지 않았으면 회원가입 진행
     * 2. DB 조회 후 있다면 해당 정보 반환
     */
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        System.out.println(oAuth2User.getAttributes());

        Map<String, Object> attributes;
        List<GrantedAuthority> authorities;

        String providerId, email, username, imageUrl;
        String role =  MemberRoleType.WORKER.name();

        // OAuth2 서버 제공자
        String registrationId = userRequest.getClientRegistration().getRegistrationId().toUpperCase();

        attributes = (Map<String, Object>) oAuth2User.getAttributes();
        providerId = attributes.get("sub").toString();
        email = attributes.get("email").toString();
        username = attributes.get("name").toString();
        imageUrl = attributes.get("picture").toString();
        boolean isExistingMember = false;


        // DB 조회 -> 있으면 업데이트, 없으면 신규 가입
        Optional<MemberEntity> entity = memberRepository.findByEmail(email);
        //존재하는 경우
        if (entity.isPresent()) {
            // role 조회
            role = entity.get().getRoleType().name();

            MemberEntity existingMember = entity.get();
            existingMember.updateInfo(username, imageUrl);

            log.info("IN DB : " + role + "username : " + entity.get().getName());
            isExistingMember = true;
            memberRepository.save(existingMember);
        } else {
            // 신규 유저 추가
            MemberEntity newMemberEntity = MemberEntity.builder()
                    .providerId(providerId)
                    .name(username)
                    .roleType(MemberRoleType.WORKER)
                    .email(email)
                    .imageUrl(imageUrl)
                    .build();

            log.info("INSERT NEW USER IN DB : " + role + "email : " + email);
            memberRepository.save(newMemberEntity);
        }

        authorities = List.of(new SimpleGrantedAuthority(role));
        return new CustomOAuthUser(attributes, authorities, email, isExistingMember);
    }

    public MemberEntity findByEmail(String email) {
        return memberRepository.findByEmail(email).get();
    }

    public List<MemberEntity> findByIds(List<Long> attendants) {
        return memberRepository.findByIds(attendants).orElse(new ArrayList<>());
    }

}
