package kr.co.wise.office.application;

import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.api.dto.proposal_attendant.PossibleAttendantsResponse;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.companymember.repository.CompanyMemberEntityRepository;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.repository.MinutesEntityRepository;
import kr.co.wise.office.domain.minutesattendant.entity.MinutesAttendantEntity;
import kr.co.wise.office.domain.minutesattendant.repository.MinutesAttendantEntityRepository;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.repository.ProposalAttendantEntityRepository;
import kr.co.wise.office.security.WithMockCustomUser;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.groups.Tuple.tuple;

class ProposalAttendantsServiceApiTest extends BaseTestEntity {

    @Autowired
    private ProposalAttendantsServiceApi proposalAttendantsServiceApi;

    @Autowired
    private CompanyMemberEntityRepository companyMemberEntityRepository;

    @Autowired
    private ProposalAttendantEntityRepository proposalAttendantEntityRepository;

    @Autowired
    private MinutesEntityRepository minutesEntityRepository;

    @Autowired
    private MinutesAttendantEntityRepository minutesAttendantEntityRepository;

    @Test
    @DisplayName("동일한 프로젝트의 회의가 잡힌 날짜에는 해당 참석자를 새로운 회의에 참여할 수 없도록 조회된다")
    @WithMockCustomUser(email = "creator@test.co.kr")
    void findPossibleAttendants_1() {
        //given
        final LocalDate minutesDate = BASE_DATE.plusDays(2);
        ProjectEntity targetProject = projectRepository.findById(projectId).orElseThrow();
        CompanyMemberEntity gildong = saveCompanyMember("홍길동");
        CompanyMemberEntity minsu = saveCompanyMember("김민수");
        ProposalAttendantEntity gilDongAttend = saveProposalAttendant(targetProject, gildong);
        ProposalAttendantEntity minSuAttend = saveProposalAttendant(targetProject, minsu);

        MinutesEntity minutes = saveMinutes(targetProject, minutesDate, List.of(gilDongAttend.getId(), minSuAttend.getId()), gilDongAttend);
        saveMinutesAttendants(minutes, gilDongAttend);

        em.flush();
        em.clear();

        //when
        List<PossibleAttendantsResponse> possibleAttendants = proposalAttendantsServiceApi.findPossibleAttendants(
                targetProject.getId(),
                minutesDate,
                creator.getEmail()
        );

        //then : 민수는 회의 참석 가능
        assertThat(possibleAttendants).hasSize(2);
        assertThat(possibleAttendants)
                .extracting(
                        PossibleAttendantsResponse::memberId,
                        PossibleAttendantsResponse::name,
                        PossibleAttendantsResponse::canAttend
                )
                .containsExactlyInAnyOrder(
                        tuple(gilDongAttend.getId(), gildong.getName(), false),
                        tuple(minSuAttend.getId(), minsu.getName(), true)
                );
    }

    @Test
    @DisplayName("같은 날짜의 다른 프로젝트의 회의 참석자는 참석 불가로 조회된다")
    @WithMockCustomUser(email = "creator@test.co.kr")
    void findPossibleAttendants_2() {
        // given
        final LocalDate minutesDate = BASE_DATE.plusDays(2);
        ProjectEntity targetProject = projectRepository.findById(projectId).orElseThrow();
        CompanyMemberEntity gildong = saveCompanyMember("홍길동");
        CompanyMemberEntity minsu = saveCompanyMember("김민수");
        ProposalAttendantEntity gilDongAttend = saveProposalAttendant(targetProject, gildong);
        ProposalAttendantEntity minsuAttend = saveProposalAttendant(targetProject, minsu);

        ProjectEntity anotherProject = saveProject("프로젝트2222");
        ProposalAttendantEntity minsuAnthoerProjectAttend = saveProposalAttendant(anotherProject, minsu);
        MinutesEntity sameDateMinutes = saveMinutes(anotherProject, minutesDate, List.of(minsuAnthoerProjectAttend.getId()), minsuAnthoerProjectAttend);
        saveMinutesAttendants(sameDateMinutes, minsuAnthoerProjectAttend);

        em.flush();
        em.clear();

        // when
        List<PossibleAttendantsResponse> responses = proposalAttendantsServiceApi.findPossibleAttendants(
                targetProject.getId(),
                minutesDate,
                creator.getEmail()
        );

        // then
        assertThat(responses).hasSize(2);
        assertThat(responses)
                .extracting(
                        PossibleAttendantsResponse::memberId,
                        PossibleAttendantsResponse::name,
                        PossibleAttendantsResponse::canAttend
                )
                .containsExactlyInAnyOrder(
                        tuple(gilDongAttend.getId(), gildong.getName(), true),
                        tuple( minsuAttend.getId(), minsu.getName(), false)
                );
    }

    private CompanyMemberEntity saveCompanyMember(String name) {
        return companyMemberEntityRepository.save(CompanyMemberEntity.builder()
                .name(name)
                .team("팀")
                .rank("계급")
                .build());
    }

    private ProposalAttendantEntity saveProposalAttendant(ProjectEntity project, CompanyMemberEntity companyMember) {
        return proposalAttendantEntityRepository.save(ProposalAttendantEntity.builder()
                .project(project)
                .companyMember(companyMember)
                .attendDate(BASE_DATE)
                .build());
    }

    private ProjectEntity saveProject(String title) {
        return projectRepository.save(ProjectEntity.builder()
                .title(title)
                .institution("기관")
                .businessName("비즈니스")
                .detail(title + " 설명")
                .startYear(BASE_DATE)
                .endYear(BASE_DATE.plusDays(10))
                .member(creator)
                .build());
    }

    private MinutesEntity saveMinutes(ProjectEntity project, LocalDate minutesDate, List<Long> attendantsId, ProposalAttendantEntity writer) {
        return minutesEntityRepository.save(MinutesEntity.from(
                new MinutesCreateRequest(
                        "주관",
                        "장소",
                        "목적",
                        minutesDate,
                        LocalTime.of(10, 0),
                        LocalTime.of(11, 0),
                        attendantsId,
                        "이재용",
                        writer.getId(),
                        "콘텐츠"
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
