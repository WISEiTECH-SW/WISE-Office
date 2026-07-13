package kr.co.wise.office.domain.companymember.service;

import jakarta.persistence.EntityManager;
import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.Project.repository.ProjectRepository;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.companymember.repository.CompanyMemberEntityRepository;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.domain.member.repository.MemberRepository;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.repository.MinutesEntityRepository;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.repository.ProposalAttendantEntityRepository;
import kr.co.wise.office.domain.proposalattendant.service.ProposalAttendantsService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class CompanyMemberServiceTest {

    @Autowired
    private CompanyMemberService companyMemberService;

    @Autowired
    private ProposalAttendantsService proposalAttendantsService;

    @Autowired
    private CompanyMemberEntityRepository companyMemberRepository;

    @Autowired
    private ProposalAttendantEntityRepository proposalAttendantRepository;

    @Autowired
    private MinutesEntityRepository minutesRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @DisplayName("퇴사 처리 후에도 기존 회의록 작성자와 프로젝트 참여 이력을 조회할 수 있다")
    void 퇴사_처리_후에도_기존_회의록_작성자와_프로젝트_참여_이력을_조회할_수_있다() {
        // given
        MemberEntity creator = memberRepository.save(MemberEntity.builder()
                .email("creator@test.co.kr")
                .name("생성자")
                .roleType(MemberRoleType.WORKER)
                .build());
        CompanyMemberEntity retiringMember = companyMemberRepository.save(CompanyMemberEntity.builder()
                .name("퇴사 예정자")
                .team("연구1팀")
                .rank("주임")
                .emailPrefix("retiring")
                .build());
        ProjectEntity project = projectRepository.save(ProjectEntity.builder()
                .title("테스트 프로젝트")
                .institution("테스트 기관")
                .businessName("테스트 사업")
                .detail("테스트 내용")
                .startYear(LocalDate.of(2025, 1, 1))
                .endYear(LocalDate.of(2025, 12, 31))
                .member(creator)
                .build());
        ProposalAttendantEntity proposalAttendant = proposalAttendantRepository.save(
                ProposalAttendantEntity.builder()
                        .companyMember(retiringMember)
                        .project(project)
                        .attendDate(LocalDate.of(2025, 1, 1))
                        .build()
        );
        MinutesEntity minutes = minutesRepository.save(MinutesEntity.from(
                new MinutesCreateRequest(
                        "테스트 기관",
                        "회의실",
                        "주간 회의",
                        LocalDate.of(2025, 1, 2),
                        LocalTime.of(10, 0),
                        LocalTime.of(11, 0),
                        java.util.List.of(proposalAttendant.getId()),
                        "",
                        proposalAttendant.getId(),
                        "회의 내용"
                ),
                project,
                1L
        ));
        MockMultipartFile memberList = createMemberListWithoutRetiringMember();

        // when
        entityManager.flush();
        companyMemberService.updateCompanyMemberInfo(memberList);
        entityManager.clear();

        // then
        CompanyMemberEntity retiredMember = companyMemberRepository.findById(retiringMember.getId()).orElseThrow();
        ProposalAttendantEntity preservedAttendant = proposalAttendantRepository.findById(proposalAttendant.getId()).orElseThrow();
        MinutesEntity preservedMinutes = minutesRepository.findById(minutes.getId()).orElseThrow();
        ProposalAttendantEntity writer = proposalAttendantsService.findWriterInfo(
                Long.parseLong(preservedMinutes.getWriter()),
                project.getId()
        );

        assertThat(retiredMember.getLeftAt()).isNotNull();
        assertThat(preservedAttendant.getExitDate()).isNotNull();
        assertThat(writer.getId()).isEqualTo(proposalAttendant.getId());
        assertThat(writer.getCompanyMember().getId()).isEqualTo(retiringMember.getId());
    }

    private MockMultipartFile createMemberListWithoutRetiringMember() {
        String row = String.join("\t",
                "재직자",
                "연구팀",
                "주임",
                "초급",
                "2025-01-01",
                "test",
                "010-0000-0000",
                "",
                "active-member"
        );

        return new MockMultipartFile(
                "list",
                "memberList.txt",
                "text/plain",
                row.getBytes(StandardCharsets.UTF_8)
        );
    }
}
