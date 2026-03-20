package kr.co.wise.office.domain.minutesattendant.service;

import jakarta.persistence.EntityManager;
import kr.co.wise.office.api.dto.minutes.MinutesAttendantsInfo;
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
import kr.co.wise.office.domain.minutesattendant.entity.MinutesAttendantEntity;
import kr.co.wise.office.domain.minutesattendant.repository.MinutesAttendantEntityRepository;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.repository.ProposalAttendantEntityRepository;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@Import(MinutesAttendantsService.class)
class MinutesAttendantsServiceTest {

    private static final LocalDate BASE_DATE = LocalDate.of(2025, 1, 1);

    @Autowired
    private MinutesAttendantsService minutesAttendantsService;

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

    private ProjectEntity project;
    private MinutesEntity minutes;
    private CompanyMemberEntity writer;
    private CompanyMemberEntity firstAttendant;
    private CompanyMemberEntity secondAttendant;
    private CompanyMemberEntity thirdAttendant;
    private CompanyMemberEntity invalidAttendant;
    private ProposalAttendantEntity writerProposal;
    private ProposalAttendantEntity firstProposal;
    private ProposalAttendantEntity secondProposal;
    private ProposalAttendantEntity thirdProposal;

    @BeforeEach
    void setUp() {
        // given
        MemberEntity creator = memberRepository.save(MemberEntity.builder()
                .name("생성자")
                .email("creator@test.co.kr")
                .roleType(MemberRoleType.WORKER)
                .build());

        project = projectRepository.save(ProjectEntity.builder()
                .title("회의록 테스트 프로젝트")
                .detail("회의록 참석자 수정 테스트")
                .institution("연구소")
                .businessName("백오피스")
                .startYear(BASE_DATE)
                .endYear(BASE_DATE.plusDays(30))
                .member(creator)
                .build());

        writer = saveCompanyMember("작성자");
        firstAttendant = saveCompanyMember("참석자1");
        secondAttendant = saveCompanyMember("참석자2");
        thirdAttendant = saveCompanyMember("참석자3");
        invalidAttendant = saveCompanyMember("제안서미포함");

        writerProposal = saveProposalAttendant(writer);
        firstProposal = saveProposalAttendant(firstAttendant);
        secondProposal = saveProposalAttendant(secondAttendant);
        thirdProposal = saveProposalAttendant(thirdAttendant);

        minutes = minutesEntityRepository.save(MinutesEntity.from(
                new MinutesCreateRequest(
                        "주관부서",
                        "회의실",
                        "주간 점검",
                        BASE_DATE.plusDays(1),
                        LocalTime.of(10, 0),
                        LocalTime.of(11, 0),
                        List.of(firstProposal.getId(), secondProposal.getId()),
                        "외부 참석자",
                        writerProposal.getId(),
                        "기존 회의 내용"
                ),
                project,
                1L
        ));

        minutesAttendantEntityRepository.saveAll(List.of(
                new MinutesAttendantEntity(writerProposal, minutes),
                new MinutesAttendantEntity(firstProposal, minutes),
                new MinutesAttendantEntity(secondProposal, minutes)
        ));

        em.flush();
        em.clear();
    }

    @Test
    @DisplayName("기존 참석자를 제거하고 신규 참석자를 추가하며 작성자 중복은 제거한다")
    void updateMinutesAttendants_기존제거와신규추가와중복제거가_함께_반영된다() {
        // given
        MinutesEntity targetMinutes = minutesEntityRepository.findById(minutes.getId()).orElseThrow();

        // when
        minutesAttendantsService.updateMinutesAttendants(
                targetMinutes,
                List.of(firstProposal.getId(), thirdProposal.getId(), writerProposal.getId()),
                project.getId()
        );
        em.flush();
        em.clear();

        // then
        List<MinutesAttendantsInfo> updateAttendantInfos = getUpdateAttendantInfos();

        assertThat(updateAttendantInfos).hasSize(3);
        assertThat(updateAttendantInfos).containsExactlyInAnyOrder(
                new MinutesAttendantsInfo(firstProposal.getId(), firstAttendant.getName(), firstAttendant.getRank()),
                new MinutesAttendantsInfo(thirdProposal.getId(), thirdAttendant.getName(), thirdAttendant.getRank()),
                new MinutesAttendantsInfo(writerProposal.getId(), writer.getName(), writer.getRank())
        );
    }

    private List<MinutesAttendantsInfo> getUpdateAttendantInfos() {
        return minutesAttendantEntityRepository.findMemberNamesByMinutesId(minutes.getId())
                .stream()
                .map(MinutesAttendantsInfo::from)
                .toList();
    }

    @Test
    @DisplayName("변경 사항이 없으면 기존 참석자 구성이 그대로 유지된다")
    void updateMinutesAttendants_변경사항이없으면_기존구성을_유지한다() {
        // given
        MinutesEntity targetMinutes = minutesEntityRepository.findById(minutes.getId()).orElseThrow();

        // when
        minutesAttendantsService.updateMinutesAttendants(
                targetMinutes,
                List.of(firstProposal.getId(), secondProposal.getId(), writerProposal.getId()),
                project.getId()
        );
        em.flush();
        em.clear();

        // then
        List<MinutesAttendantsInfo> updateAttendantInfos = getUpdateAttendantInfos();
        assertThat(updateAttendantInfos).hasSize(3);
        assertThat(updateAttendantInfos).containsExactlyInAnyOrder(
                new MinutesAttendantsInfo(firstProposal.getId(), firstAttendant.getName(), firstAttendant.getRank()),
                new MinutesAttendantsInfo(secondProposal.getId(), secondAttendant.getName(), secondAttendant.getRank()),
                new MinutesAttendantsInfo(writerProposal.getId(), writer.getName(), writer.getRank())
        );
    }

    @Test
    @DisplayName("제안서 참석자가 아닌 사람이 포함되면 예외가 발생하고 기존 참석자는 유지된다")
    void updateMinutesAttendants_제안서미포함인원이있으면_예외가발생하고기존데이터가유지된다() {
        // given
        MinutesEntity targetMinutes = minutesEntityRepository.findById(minutes.getId()).orElseThrow();

        // when & then
        assertThatThrownBy(() -> minutesAttendantsService.updateMinutesAttendants(
                targetMinutes,
                List.of(firstProposal.getId(), 999999L),
                project.getId()
        )).isInstanceOf(ApplicationRuntimeException.class)
                .extracting("errorMessage")
                .extracting("message")
                .isEqualTo(ErrorMessage.REJECT_MODIFYING_MINUTES.getMessage());

        em.flush();
        em.clear();

        List<MinutesAttendantsInfo> failAttendantsInfo = getUpdateAttendantInfos();
        assertThat(failAttendantsInfo).hasSize(3);
        assertThat(failAttendantsInfo).containsExactlyInAnyOrder(
                new MinutesAttendantsInfo(firstProposal.getId(), firstAttendant.getName(), firstAttendant.getRank()),
                new MinutesAttendantsInfo(secondProposal.getId(), secondAttendant.getName(), secondAttendant.getRank()),
                new MinutesAttendantsInfo(writerProposal.getId(), writer.getName(), writer.getRank())
        );
    }

    private CompanyMemberEntity saveCompanyMember(String name) {
        return companyMemberEntityRepository.save(CompanyMemberEntity.builder()
                .name(name)
                .team("연구기획팀")
                .rank("사원")
                .build());
    }

    private ProposalAttendantEntity saveProposalAttendant(CompanyMemberEntity companyMember) {
        return proposalAttendantEntityRepository.save(ProposalAttendantEntity.builder()
                .companyMember(companyMember)
                .project(project)
                .attendDate(BASE_DATE)
                .build());
    }
}
