package kr.co.wise.office.application;

import jakarta.persistence.EntityManager;
import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.api.dto.overview.MonthlyDocumentGroupResponse;
import kr.co.wise.office.api.dto.overview.MonthlyDocumentPairResponse;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.Project.repository.ProjectRepository;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.approve.repository.ApproveEntityRepository;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.companymember.repository.CompanyMemberEntityRepository;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.domain.member.repository.MemberRepository;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.repository.MinutesEntityRepository;
import kr.co.wise.office.domain.minutesattendant.entity.MinutesAttendantEntity;
import kr.co.wise.office.domain.minutesattendant.repository.MinutesAttendantEntityRepository;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.repository.ProposalAttendantEntityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(OverviewServiceApi.class)
@DisplayName("OverviewServiceApi 월간 문서 조회 테스트")
class OverviewServiceApiTest {

    @Autowired
    private OverviewServiceApi overviewServiceApi;

    @Autowired
    private EntityManager em;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private CompanyMemberEntityRepository companyMemberEntityRepository;

    @Autowired
    private ProposalAttendantEntityRepository proposalAttendantEntityRepository;

    @Autowired
    private MinutesEntityRepository minutesEntityRepository;

    @Autowired
    private MinutesAttendantEntityRepository minutesAttendantEntityRepository;

    @Autowired
    private ApproveEntityRepository approveEntityRepository;

    private ProjectEntity projectA;
    private ProjectEntity projectB;
    private ProposalAttendantEntity writerAProposal;
    private ProposalAttendantEntity attendantA1Proposal;
    private ProposalAttendantEntity attendantA2Proposal;
    private ProposalAttendantEntity writerBProposal;
    private ProposalAttendantEntity attendantB1Proposal;
    private MinutesEntity marchMinutesWithApprove;
    private MinutesEntity marchMinutesWithoutApprove;
    private ApproveEntity marchApprove;

    @BeforeEach
    void setUp() {
        // given
        MemberEntity creator = memberRepository.save(MemberEntity.builder()
                .name("creator")
                .email("creator@test.co.kr")
                .roleType(MemberRoleType.WORKER)
                .build());

        projectA = saveProject("Project A", creator);
        projectB = saveProject("Project B", creator);

        CompanyMemberEntity writerA = saveCompanyMember("WriterA");
        CompanyMemberEntity attendantA1 = saveCompanyMember("AttendantA1");
        CompanyMemberEntity attendantA2 = saveCompanyMember("AttendantA2");
        CompanyMemberEntity writerB = saveCompanyMember("WriterB");
        CompanyMemberEntity attendantB1 = saveCompanyMember("AttendantB1");

        writerAProposal = saveProposalAttendant(projectA, writerA);
        attendantA1Proposal = saveProposalAttendant(projectA, attendantA1);
        attendantA2Proposal = saveProposalAttendant(projectA, attendantA2);
        writerBProposal = saveProposalAttendant(projectB, writerB);
        attendantB1Proposal = saveProposalAttendant(projectB, attendantB1);

        marchMinutesWithApprove = saveMinutes(
                projectA,
                LocalDate.of(2026, 3, 18),
                LocalTime.of(10, 0),
                LocalTime.of(12, 0),
                writerAProposal,
                List.of(attendantA1Proposal.getId(), attendantA2Proposal.getId()),
                "3월 회의록 - 품의서 포함"
        );
        saveMinutesAttendants(marchMinutesWithApprove, writerAProposal, attendantA1Proposal, attendantA2Proposal);
        marchApprove = approveEntityRepository.save(ApproveEntity.from(marchMinutesWithApprove, LocalDate.of(2026, 3, 19), writerInfo.getCompanyMember().getName()));

        MinutesEntity previousMonthMinutesWithCurrentApprove = saveMinutes(
                projectA,
                LocalDate.of(2026, 2, 27),
                LocalTime.of(14, 0),
                LocalTime.of(15, 0),
                writerAProposal,
                List.of(attendantA1Proposal.getId()),
                "2월 회의록 - 품의서 포함"
        );
        saveMinutesAttendants(previousMonthMinutesWithCurrentApprove, writerAProposal, attendantA1Proposal);
        approveEntityRepository.save(ApproveEntity.from(previousMonthMinutesWithCurrentApprove, LocalDate.of(2026, 3, 2), writerInfo.getCompanyMember().getName()));

        marchMinutesWithoutApprove = saveMinutes(
                projectB,
                LocalDate.of(2026, 3, 4),
                LocalTime.of(9, 0),
                LocalTime.of(10, 0),
                writerBProposal,
                List.of(attendantB1Proposal.getId()),
                "3월 회의록 - 품의서 미포함"
        );
        saveMinutesAttendants(marchMinutesWithoutApprove, writerBProposal, attendantB1Proposal);

        MinutesEntity ignoredMinutes = saveMinutes(
                projectB,
                LocalDate.of(2026, 2, 10),
                LocalTime.of(8, 0),
                LocalTime.of(9, 0),
                writerBProposal,
                List.of(attendantB1Proposal.getId()),
                "2월 회의록 - 품의서 미포함"
        );
        saveMinutesAttendants(ignoredMinutes, writerBProposal, attendantB1Proposal);

        em.flush();
        em.clear();
    }

    @Test
    @DisplayName("이번 달 문서를 과제별로 묶어서 조회한다")
    void 이번달_문서를_과제별로_묶어서_조회한다() {
        // when
        List<MonthlyDocumentGroupResponse> responses = overviewServiceApi.getMonthlyDocuments(2026, 3);

        // then
        assertThat(responses).hasSize(2);
        assertThat(responses)
                .extracting(MonthlyDocumentGroupResponse::title)
                .containsExactlyInAnyOrder("Project A", "Project B");

        Map<String, MonthlyDocumentGroupResponse> responseByTitle = responses.stream()
                .collect(Collectors.toMap(MonthlyDocumentGroupResponse::title, Function.identity()));

        MonthlyDocumentGroupResponse projectAResponse = responseByTitle.get("Project A");
        assertThat(projectAResponse.pair()).hasSize(1);
        assertApprovedPair(
                projectAResponse.pair().get(0),
                LocalDate.of(2026, 3, 18),
                marchMinutesWithApprove.getTitle(),
                "WriterA,AttendantA1,AttendantA2",
                marchMinutesWithApprove.getId(),
                marchApprove.getReportNo()
        );

        MonthlyDocumentGroupResponse projectBResponse = responseByTitle.get("Project B");
        assertThat(projectBResponse.pair()).hasSize(1);
        assertMinutesOnlyPair(
                projectBResponse.pair().get(0),
                LocalDate.of(2026, 3, 4),
                marchMinutesWithoutApprove.getTitle(),
                "WriterB,AttendantB1",
                marchMinutesWithoutApprove.getId()
        );
    }

    private void assertApprovedPair(
            MonthlyDocumentPairResponse pair,
            LocalDate minutesDate,
            String minutesTitle,
            String attendants,
            Long minutesId,
            String approveTitle
    ) {
        assertThat(pair.minutes().minutesDate()).isEqualTo(minutesDate);
        assertThat(pair.minutes().minutesTitle()).isEqualTo(minutesTitle);
        assertThat(pair.minutes().attendants()).isEqualTo(attendants);
        assertThat(pair.minutes().minutesId()).isEqualTo(minutesId);
        assertThat(pair.approve()).isNotNull();
        assertThat(pair.approve().approveTitle()).isEqualTo(approveTitle);
        assertThat(pair.approve().approveId()).isNotNull();
    }

    private void assertMinutesOnlyPair(
            MonthlyDocumentPairResponse pair,
            LocalDate minutesDate,
            String minutesTitle,
            String attendants,
            Long minutesId
    ) {
        assertThat(pair.minutes().minutesDate()).isEqualTo(minutesDate);
        assertThat(pair.minutes().minutesTitle()).isEqualTo(minutesTitle);
        assertThat(pair.minutes().attendants()).isEqualTo(attendants);
        assertThat(pair.minutes().minutesId()).isEqualTo(minutesId);
        assertThat(pair.approve()).isNull();
    }

    private ProjectEntity saveProject(String title, MemberEntity creator) {
        return projectRepository.save(ProjectEntity.builder()
                .title(title)
                .detail(title + " detail")
                .institution("Institution")
                .businessName("Business")
                .startYear(LocalDate.of(2026, 1, 1))
                .endYear(LocalDate.of(2026, 12, 31))
                .member(creator)
                .build());
    }

    private CompanyMemberEntity saveCompanyMember(String name) {
        return companyMemberEntityRepository.save(CompanyMemberEntity.builder()
                .name(name)
                .team("Strategy Team")
                .rank("Manager")
                .build());
    }

    private ProposalAttendantEntity saveProposalAttendant(ProjectEntity project, CompanyMemberEntity companyMember) {
        return proposalAttendantEntityRepository.save(ProposalAttendantEntity.builder()
                .project(project)
                .companyMember(companyMember)
                .attendDate(LocalDate.of(2026, 1, 1))
                .build());
    }

    private MinutesEntity saveMinutes(
            ProjectEntity project,
            LocalDate minutesDate,
            LocalTime startTime,
            LocalTime endTime,
            ProposalAttendantEntity writer,
            List<Long> minutesAttendants,
            String content
    ) {
        return minutesEntityRepository.save(MinutesEntity.from(
                new MinutesCreateRequest(
                        "Host",
                        "Meeting Room",
                        "Monthly overview",
                        minutesDate,
                        startTime,
                        endTime,
                        minutesAttendants,
                        "External attendees",
                        writer.getId(),
                        content
                ),
                project,
                minutesEntityRepository.countByMinutesDate(minutesDate, project.getId()) + 1L
        ));
    }

    private void saveMinutesAttendants(MinutesEntity minutes, ProposalAttendantEntity... proposals) {
        minutesAttendantEntityRepository.saveAll(
                List.of(proposals).stream()
                        .map(proposal -> new MinutesAttendantEntity(proposal, minutes))
                        .toList()
        );
    }
}
