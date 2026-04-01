package kr.co.wise.office.api;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantRole;
import kr.co.wise.office.domain.proposalattendant.service.ProposalAttendantService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProposalAttendantServiceTest extends ApiControllerTestSupport {

    @Autowired
    private ProposalAttendantService proposalAttendantService;

    private Long projectId;
    private ProjectEntity project;

    // 초기 상태: memberA = PM, memberB = NORMAL
    private CompanyMemberEntity memberA;
    private CompanyMemberEntity memberB;
    private CompanyMemberEntity memberC;

    @BeforeEach
    void setUp() {
        MemberEntity creator = createMember("creator@test.co.kr", "생성자", MemberRoleType.WORKER);
        memberA = createCompanyMember("멤버A");
        memberB = createCompanyMember("멤버B");
        memberC = createCompanyMember("멤버C");

        ProjectFixture fixture = createProjectFixture(
                "테스트 프로젝트",
                "테스트 기관",
                "테스트 사업명",
                "테스트 내용",
                creator,
                creator,
                List.of(),
                List.of(memberA, memberB), // memberA = PM, memberB = NORMAL,
                memberA
        );

        projectId = fixture.projectId();
        project = em.find(ProjectEntity.class, projectId);
        em.flush();
        em.clear();
    }

    @Nested
    @DisplayName("신규 멤버 추가")
    class 신규_멤버_추가 {

        @Test
        @DisplayName("새로 추가된 멤버가 PM이 아닌 경우 NORMAL role로 저장된다")
        void 새로_추가된_멤버가_PM이_아닌_경우_NORMAL_role로_저장된다() {
            // given
            Long pmId = memberA.getId();

            // when
            proposalAttendantService.updateProposalAttendants(project, List.of(memberA, memberB, memberC), pmId);
            em.flush();
            em.clear();

            // then
            Map<Long, ProposalAttendantEntity> result = findResultAsMap();
            assertThat(result).containsKey(memberC.getId());
            assertThat(result.get(memberC.getId()).getRole()).isEqualTo(ProposalAttendantRole.NORMAL);
        }

        @Test
        @DisplayName("새로 추가된 멤버가 PM으로 지정되면 PM role로 저장된다")
        void 새로_추가된_멤버가_PM으로_지정되면_PM_role로_저장된다() {
            // given
            Long pmId = memberC.getId();

            // when
            proposalAttendantService.updateProposalAttendants(project, List.of(memberA, memberB, memberC), pmId);
            em.flush();
            em.clear();

            // then
            Map<Long, ProposalAttendantEntity> result = findResultAsMap();
            assertThat(result).containsKey(memberC.getId());
            assertThat(result.get(memberC.getId()).getRole()).isEqualTo(ProposalAttendantRole.PM);
            assertThat(result.get(memberA.getId()).getRole()).isEqualTo(ProposalAttendantRole.NORMAL); // 기존 PM은 NORMAL 변경
        }
    }

    @Nested
    @DisplayName("기존 멤버 삭제")
    class 기존_멤버_삭제 {

        @Test
        @DisplayName("새 목록에 없는 멤버는 DB에서 삭제된다")
        void 새_목록에_없는_멤버는_DB에서_삭제된다() {
            // given
            Long pmId = memberA.getId();

            // when
            proposalAttendantService.updateProposalAttendants(project, List.of(memberA), pmId);
            em.flush();
            em.clear();

            // then
            Map<Long, ProposalAttendantEntity> result = findResultAsMap();
            assertThat(result).doesNotContainKey(memberB.getId());
            assertThat(result).containsKey(memberA.getId());
        }

        @Test
        @DisplayName("모든 멤버가 교체되면 기존 멤버는 전부 삭제되고 신규 멤버만 저장된다")
        void 모든_멤버가_교체되면_기존_멤버는_전부_삭제되고_신규_멤버만_저장된다() {
            // given
            Long pmId = memberC.getId();

            // when
            proposalAttendantService.updateProposalAttendants(project, List.of(memberC), pmId);
            em.flush();
            em.clear();

            // then
            Map<Long, ProposalAttendantEntity> result = findResultAsMap();
            assertThat(result).doesNotContainKey(memberA.getId());
            assertThat(result).doesNotContainKey(memberB.getId());
            assertThat(result).containsKey(memberC.getId());
            assertThat(result.get(memberC.getId()).getRole()).isEqualTo(ProposalAttendantRole.PM);
        }
    }

    @Nested
    @DisplayName("기존 멤버 role 변경")
    class 기존_멤버_role_변경 {

        @Test
        @DisplayName("기존 NORMAL 멤버가 새 PM으로 지정되면 role이 PM으로 변경된다")
        void 기존_NORMAL_멤버가_새_PM으로_지정되면_role이_PM으로_변경된다() {
            // given
            Long newPmId = memberB.getId(); // memberB는 현재 NORMAL

            // when
            proposalAttendantService.updateProposalAttendants(project, List.of(memberA, memberB), newPmId);
            em.flush();
            em.clear();

            // then
            Map<Long, ProposalAttendantEntity> result = findResultAsMap();
            assertThat(result.get(memberB.getId()).getRole()).isEqualTo(ProposalAttendantRole.PM);
        }

        @Test
        @DisplayName("기존 PM 멤버가 PM에서 제외되면 role이 NORMAL로 변경된다")
        void 기존_PM_멤버가_PM에서_제외되면_role이_NORMAL로_변경된다() {
            // given
            Long newPmId = memberB.getId(); // memberA는 현재 PM, 이제 memberB가 PM

            // when
            proposalAttendantService.updateProposalAttendants(project, List.of(memberA, memberB), newPmId);
            em.flush();
            em.clear();

            // then
            Map<Long, ProposalAttendantEntity> result = findResultAsMap();
            assertThat(result.get(memberA.getId()).getRole()).isEqualTo(ProposalAttendantRole.NORMAL);
        }

        @Test
        @DisplayName("PM이 변경되면 기존 PM은 NORMAL로, 새 PM은 PM role로 동시에 반영된다")
        void PM이_변경되면_기존_PM은_NORMAL로_새_PM은_PM_role로_동시에_반영된다() {
            // given
            Long newPmId = memberB.getId();

            // when
            proposalAttendantService.updateProposalAttendants(project, List.of(memberA, memberB), newPmId);
            em.flush();
            em.clear();

            // then
            Map<Long, ProposalAttendantEntity> result = findResultAsMap();
            assertThat(result.get(memberA.getId()).getRole()).isEqualTo(ProposalAttendantRole.NORMAL);
            assertThat(result.get(memberB.getId()).getRole()).isEqualTo(ProposalAttendantRole.PM);
        }

        @Test
        @DisplayName("기존 PM이 그대로 PM으로 유지되면 role이 변경되지 않는다")
        void 기존_PM이_그대로_PM으로_유지되면_role이_변경되지_않는다() {
            // given
            Long pmId = memberA.getId(); // memberA는 현재 PM, 그대로 유지

            // when
            proposalAttendantService.updateProposalAttendants(project, List.of(memberA, memberB), pmId);
            em.flush();
            em.clear();

            // then
            Map<Long, ProposalAttendantEntity> result = findResultAsMap();
            assertThat(result.get(memberA.getId()).getRole()).isEqualTo(ProposalAttendantRole.PM);
            assertThat(result.get(memberB.getId()).getRole()).isEqualTo(ProposalAttendantRole.NORMAL);
        }
    }

    private Map<Long, ProposalAttendantEntity> findResultAsMap() {
        return proposalAttendantEntityRepository.findAllByProject_Id(projectId).stream()
                .collect(Collectors.toMap(
                        a -> a.getCompanyMember().getId(),
                        Function.identity()
                ));
    }
}
