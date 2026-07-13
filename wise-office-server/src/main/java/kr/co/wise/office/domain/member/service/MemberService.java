package kr.co.wise.office.domain.member.service;

import kr.co.wise.office.domain.attendant.service.AttendantService;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.companymember.repository.CompanyMemberEntityRepository;
import kr.co.wise.office.domain.member.dto.*;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.domain.member.repository.MemberRepository;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import kr.co.wise.office.exception.custom.UnAuthorizationException;
import kr.co.wise.office.util.JWTUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class MemberService extends DefaultOAuth2UserService implements UserDetailsService {

    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final int MAX_PASSWORD_LENGTH = 20;

    private final MemberRepository memberRepository;
    private final AttendantService attendantService;
    private final PasswordEncoder passwordEncoder;
    private final CompanyMemberEntityRepository companyMemberEntityRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        MemberEntity member = memberRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(ErrorMessage.NOT_FOUND_MEMBER.getMessage()));
        return User.builder()
                .username(member.getEmail())
                .password(member.getPassword())
                .roles(member.getRoleType().name())
                .build();
    }

    @Transactional
    public void signUp(SignupRequest request, String imagePath) {
        if (memberRepository.findByEmail(request.email()).isPresent()) {
            throw new UnAuthorizationException(ErrorMessage.AlREADY_SIGNUP_EMAIL);
        }
        validatePassword(request.password(), request.passwordMatch());

        MemberEntity newMember = MemberEntity.builder()
                .name(request.name())
                .email(request.email())
                .team(request.team())
                .rank(request.rank())
                .password(passwordEncoder.encode(request.password()))
                .roleType(MemberRoleType.WORKER)
                .imageUrl(imagePath)
                .hireDate(request.hireDate())
                .build();

        memberRepository.save(newMember);
    }

    @Transactional(readOnly = true)
    public String login(LoginRequest loginRequest) {
        MemberEntity member = findUserWithEmail(loginRequest.email());
        if (!passwordEncoder.matches(loginRequest.password(), member.getPassword())) {
            throw new UnAuthorizationException(ErrorMessage.INVALID_MEMBER);
        }

        String token = JWTUtil.createJWT(member.getEmail(), "ROLE_" + member.getRoleType().name());
        return token;
    }

    /**
     * Google-login 시도시 수행되는 로직
     * 1. 아직 회원가입 하지 않았으면 회원가입 진행
     * 2. DB 조회 후 있다면 해당 정보 반환
     */
    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        System.out.println(oAuth2User.getAttributes());

        Map<String, Object> attributes;
        List<GrantedAuthority> authorities;

        String providerId, email, username, imageUrl;
        String role = MemberRoleType.WORKER.name();

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
        // 존재하는 경우
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

    @Transactional(readOnly = true)
    public MemberEntity findById(Long memberId) {
        return memberRepository.findById(memberId).orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_MEMBER));
    }

    @Transactional(readOnly = true)
    public MemberEntity findByEmail(String loginUserEmail) {
        return findUserWithEmail(loginUserEmail);
    }

    @Transactional(readOnly = true)
    public List<MemberEntity> findByIds(List<Long> attendants) {
        return memberRepository.findByIds(attendants).orElse(new ArrayList<>());
    }

    @Transactional(readOnly = true)
    public MemberGroupedResponse searchAllMemberInfo(String loginUserEmail) {
        List<MemberEntity> members = memberRepository.findAll();
        List<CompanyMemberEntity> cMembers = companyMemberEntityRepository.findByLeftAtIsNull();

        List<MemberListResponse> projectMembers = members.stream().map(MemberListResponse::loadMemberInfo).toList();
        List<MemberListResponse> companyMembers = cMembers.stream().map(MemberListResponse::convertCompanyMembertoMember).toList();
        MemberGroupedResponse res = new MemberGroupedResponse(projectMembers, companyMembers);

        return res;
    }

    @Transactional(readOnly = true)
    public MyAccountResponse getMyAccountInfo(String loginUserEmail) {
        MemberEntity account = findByEmail(loginUserEmail);
        MyAccountResponse response = MyAccountResponse.loadMyAccountInfo(account,
                attendantService.getProjectsByAttendants(account));
        return response;
    }

    @Transactional
    public void updateMemberProfile(String savedImageName, String loginUserEmail) {
        MemberEntity member = findUserWithEmail(loginUserEmail);
        member.updateInfo(member.getName(), savedImageName);
    }

    @Transactional(readOnly = true)
    public void checkAlreadySignUp(String loginUserEmail) {
        memberRepository.findByEmail(loginUserEmail).ifPresent(member -> {
            throw new ApplicationRuntimeException(ErrorMessage.AlREADY_SIGNUP_EMAIL);
        });
    }

    @Transactional(readOnly = true)
    public HireDateResponse getHireDate(String loginUserEmail) {
        MemberEntity member = findUserWithEmail(loginUserEmail);
        return new HireDateResponse(member.getHireDate());
    }

    @Transactional(readOnly = true)
    public void checkSignUp(String email) {
        memberRepository.findByEmail(email).orElseThrow(() ->
                new NotFoundResourceException(ErrorMessage.NOT_FOUND_MEMBER)
        );
    }

    private MemberEntity findUserWithEmail(String loginUserEmail) {
        return memberRepository.findByEmail(loginUserEmail).orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_MEMBER));
    }

    @Transactional
    public void updateMember(String email, MemberUpdateRequest req) {
        MemberEntity member = findUserWithEmail(email);

        // 바뀐 값만 변경되도록 수정 
        if (req.team() != null && !req.team().equals(member.getTeam())) {
            member.updateTeam(req.team());
        }

        if (req.rank() != null && !req.rank().equals(member.getRank())) {
            member.updateRank(req.rank());
        }

        if (req.hireDate() != null && !req.hireDate().equals(member.getHireDate())) {
            member.updateHireDate(req.hireDate());
        }
    }

    @Transactional
    public void changePassword(String email, String password, String passwordCheck) {
        validatePassword(password, passwordCheck);
        MemberEntity changeMember = findUserWithEmail(email);
        changeMember.updatePassword(passwordEncoder.encode(password));
    }

    private void validatePassword(String password, String passwordCheck) {
        if (password.length() < MIN_PASSWORD_LENGTH || password.length() > MAX_PASSWORD_LENGTH) {
            throw new ApplicationRuntimeException(ErrorMessage.INVALID_PASSWORD_LENGTH);
        }
        if (!password.equals(passwordCheck)) {
            throw new ApplicationRuntimeException(ErrorMessage.NOT_EQUAL_PASSWORD);
        }
    }

}