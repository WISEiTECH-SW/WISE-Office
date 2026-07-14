package kr.co.wise.office.setup;

import kr.co.wise.office.domain.companymember.service.CompanyMemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;


@ConditionalOnProperty(
        prefix = "member",
        name = "init-enabled",
        havingValue = "true"
)
@Component
@RequiredArgsConstructor
@Slf4j
public class CompanyMemberInitRunner implements CommandLineRunner {

    private final CompanyMemberService companyMemberService;

    @Value("${member.init-path}")
    private String memberInitPath;

    @Override
    public void run(String... args) {
        ClassPathResource memberList = new ClassPathResource(memberInitPath);

        if (!memberList.exists()) {
            throw new IllegalStateException("사원 초기화 파일을 찾을 수 없습니다: " + memberInitPath);
        }

        companyMemberService.updateCompanyMemberInfo(memberList);
        log.info("사원 정보 초기화 완료: {}", memberInitPath);
    }

}