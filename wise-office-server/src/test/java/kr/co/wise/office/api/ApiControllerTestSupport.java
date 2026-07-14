package kr.co.wise.office.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.application.MinutesServiceApi;
import kr.co.wise.office.application.ProjectServiceApi;
import kr.co.wise.office.domain.Project.dto.ProjectCreateRequest;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.approve.repository.ApproveEntityRepository;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.companymember.repository.CompanyMemberEntityRepository;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.domain.member.repository.MemberRepository;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.repository.MinutesEntityRepository;
import kr.co.wise.office.domain.minutesattendant.repository.MinutesAttendantEntityRepository;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.repository.ProposalAttendantEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

abstract class ApiControllerTestSupport {

    protected static final LocalDate BASE_DATE = LocalDate.of(2025, 1, 1);

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected EntityManager em;

    @Autowired
    protected MemberRepository memberRepository;

    @Autowired
    protected CompanyMemberEntityRepository companyMemberEntityRepository;

    @Autowired
    protected ProposalAttendantEntityRepository proposalAttendantEntityRepository;

    @Autowired
    protected MinutesEntityRepository minutesEntityRepository;

    @Autowired
    protected MinutesAttendantEntityRepository minutesAttendantEntityRepository;

    @Autowired
    protected ApproveEntityRepository approveEntityRepository;

    @Autowired
    protected ProjectServiceApi projectServiceApiV2;

    @Autowired
    protected MinutesServiceApi minutesServiceApi;

    protected MemberEntity createMember(String email, String name, MemberRoleType roleType) {
        return memberRepository.save(MemberEntity.builder()
                .email(email)
                .name(name)
                .roleType(roleType)
                .build());
    }

    protected CompanyMemberEntity createCompanyMember(String name) {
        return createCompanyMember(name, "Strategy Team", "Manager");
    }

    protected CompanyMemberEntity createCompanyMember(String name, String team, String rank) {
        return companyMemberEntityRepository.save(CompanyMemberEntity.builder()
                .name(name)
                .team(team)
                .rank(rank)
                .build());
    }

    protected ProjectFixture createProjectFixture(
            String title,
            String institution,
            String businessName,
            String content,
            MemberEntity creator,
            MemberEntity projectLeader,
            List<MemberEntity> workers,
            List<CompanyMemberEntity> proposalCompanyMembers,
            CompanyMemberEntity projectManager
    ) {
        Long projectId = projectServiceApiV2.createProject(
                new ProjectCreateRequest(
                        title,
                        institution,
                        businessName,
                        BASE_DATE,
                        BASE_DATE.plusDays(10),
                        content,
                        creator.getId(),
                        workers.stream().map(MemberEntity::getId).toList(),
                        proposalCompanyMembers.stream().map(CompanyMemberEntity::getId).toList(),
                        proposalCompanyMembers.get(0).getId()
                ),
                creator.getEmail()
        ).getProjectId();

        Map<Long, ProposalAttendantEntity> proposalsByCompanyMemberId = proposalAttendantEntityRepository.findByProjectIdWithCompanyName(projectId).stream()
                .collect(Collectors.toMap(
                        proposal -> proposal.getCompanyMember().getId(),
                        Function.identity()
                ));

        return new ProjectFixture(projectId, proposalsByCompanyMemberId);
    }

    protected MinutesCreateRequest createMinutesRequest(
            String host,
            String location,
            String purpose,
            LocalDate minutesDate,
            LocalTime startTime,
            LocalTime endTime,
            List<Long> minutesAttendants,
            String instAttendants,
            Long writerId,
            String content
    ) {
        return new MinutesCreateRequest(
                host,
                location,
                purpose,
                minutesDate,
                startTime,
                endTime,
                minutesAttendants,
                instAttendants,
                writerId,
                content
        );
    }

    protected JsonNode createMinutesResponse(Long projectId, String creatorEmail, MinutesCreateRequest request) throws Exception {
        return objectMapper.valueToTree(minutesServiceApi.createMinutes(projectId, creatorEmail, request));
    }

    protected MinutesEntity createMinutes(Long projectId, String creatorEmail, MinutesCreateRequest request) throws Exception {
        JsonNode createdMinutes = createMinutesResponse(projectId, creatorEmail, request);
        return minutesEntityRepository.findById(createdMinutes.get("minutesId").asLong()).orElseThrow();
    }

    protected ApproveEntity saveApprove(MinutesEntity minutes, LocalDate submitDate, String writerName) {
        return approveEntityRepository.save(ApproveEntity.from(minutes, submitDate, writerName));
    }

    protected JsonNode readBody(ResultActions result) throws Exception {
        return objectMapper.readTree(result.andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8));
    }

    protected record ProjectFixture(Long projectId, Map<Long, ProposalAttendantEntity> proposalsByCompanyMemberId) {
        ProposalAttendantEntity proposalOf(CompanyMemberEntity companyMember) {
            return Objects.requireNonNull(
                    proposalsByCompanyMemberId.get(companyMember.getId()),
                    "proposal attendant not found for company member " + companyMember.getId()
            );
        }
    }
}
