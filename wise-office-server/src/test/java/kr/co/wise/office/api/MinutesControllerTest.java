package kr.co.wise.office.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import kr.co.wise.office.api.dto.minutes.MinutesAttendantsInfo;
import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.api.dto.minutes.MinutesUpdateRequest;
import kr.co.wise.office.application.MinutesServiceApi;
import kr.co.wise.office.application.ProjectServiceApi;
import kr.co.wise.office.domain.Project.dto.ProjectCreateRequest;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
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
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.external.hoilday.dto.HolidayCalculator;
import kr.co.wise.office.security.WithMockCustomUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.groups.Tuple.tuple;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("MinutesController 통합 테스트")
class MinutesControllerTest {

    private static final LocalDate BASE_DATE = LocalDate.of(2025, 1, 1);

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private CompanyMemberEntityRepository companyMemberEntityRepository;

    @Autowired
    private ProjectServiceApi projectServiceApiV2;

    @Autowired
    private MinutesServiceApi minutesServiceApi;

    @Autowired
    private MinutesEntityRepository minutesEntityRepository;

    @Autowired
    private MinutesAttendantEntityRepository minutesAttendantEntityRepository;

    @Autowired
    private ProposalAttendantEntityRepository proposalAttendantEntityRepository;

    @Autowired
    private ApproveEntityRepository approveEntityRepository;

    @MockBean
    private HolidayCalculator holidayCalculator;

    private Long projectId;
    private MemberEntity creator;
    private MemberEntity manager;
    private MemberEntity worker;
    private MemberEntity outsider;

    private ProposalAttendantEntity writerProposalAttendant;
    private ProposalAttendantEntity firstProposalAttendant;
    private ProposalAttendantEntity secondProposalAttendant;

    private CompanyMemberEntity writerCompanyMember;
    private CompanyMemberEntity firstAttendant;
    private CompanyMemberEntity secondAttendant;
    private CompanyMemberEntity notIncludedAttendant;

    @BeforeEach
    void setUp() {
        creator = createMember("creator@test.co.kr", "생성자", MemberRoleType.WORKER);
        manager = createMember("manager@test.co.kr", "매니저", MemberRoleType.WORKER);
        worker = createMember("worker@test.co.kr", "실무자", MemberRoleType.WORKER);
        outsider = createMember("outsider@test.co.kr", "외부사용자", MemberRoleType.WORKER);

        writerCompanyMember = createCompanyMember("작성자");
        firstAttendant = createCompanyMember("참석자1");
        secondAttendant = createCompanyMember("참석자2");
        notIncludedAttendant = createCompanyMember("미등록참석자");

        ProjectCreateRequest request = new ProjectCreateRequest(
                "회의록 프로젝트",
                "연구소",
                "백오피스 고도화",
                BASE_DATE,
                BASE_DATE.plusDays(10),
                "회의록 테스트용 프로젝트",
                manager.getId(),
                List.of(worker.getId()),
                List.of(writerCompanyMember.getId(), firstAttendant.getId(), secondAttendant.getId()),
                2l
        );

        ProjectCreateRequest request2 = new ProjectCreateRequest(
                "회의록 프로젝트",
                "연구소",
                "백오피스 고도화",
                BASE_DATE,
                BASE_DATE.plusDays(10),
                "회의록 테스트용 프로젝트",
                manager.getId(),
                List.of(worker.getId()),
                List.of(writerCompanyMember.getId(), firstAttendant.getId(), secondAttendant.getId()),
                100l
        );

        projectId = projectServiceApiV2.createProject(request, creator.getEmail()).getProjectId();

        writerProposalAttendant = createProposalAttendants(
                ProjectEntity.builder().id(projectId).build(),
                writerCompanyMember
        );

        firstProposalAttendant = createProposalAttendants(
                ProjectEntity.builder().id(projectId).build(),
                firstAttendant
        );

        secondProposalAttendant = createProposalAttendants(
                ProjectEntity.builder().id(projectId).build(),
                secondAttendant
        );

    }

    @Nested
    @DisplayName("회의록 목록 조회")
    class GetMinutesList {

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("프로젝트 참여자는 회의록 목록을 최신순으로 조회할 수 있다")
        void 프로젝트_참여자는_회의록_목록을_최신순으로_조회할_수_있다() throws Exception {
            // given
            createMinutesByService(createMinutesRequest(
                    BASE_DATE.plusDays(1),
                    List.of(firstProposalAttendant.getId(), secondProposalAttendant.getId())
            ));
            MinutesEntity latestMinutes = minutesEntityRepository.findById(
                    createMinutesByService(createMinutesRequest(
                            BASE_DATE.plusDays(2),
                            List.of(writerProposalAttendant.getId(), secondProposalAttendant.getId())
                    )).get("minutesId").asLong()
            ).orElseThrow();
            em.flush();
            em.clear();

            // when
            ResultActions result = mockMvc.perform(get("/api/projects/{projectId}/minutes", projectId));
            JsonNode response = readBody(result);

            // then
            result.andExpect(status().isOk())
                    .andDo(print());
            assertThat(response).hasSize(2);
            assertThat(response.get(0).get("minutesId").asLong()).isEqualTo(latestMinutes.getId());
            assertThat(response.get(0).get("title").asText()).isEqualTo(latestMinutes.getTitle());
            assertThat(response.get(0).get("minutesAt").asText()).isEqualTo(latestMinutes.getMinutesDate().toString());
        }
    }

    @Nested
    @DisplayName("회의록 생성")
    class CreateMinutes {

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("프로젝트 참여자는 회의록을 생성할 수 있다")
        void 프로젝트_참여자는_회의록을_생성할_수_있다() throws Exception {
            // given
            MinutesCreateRequest request = createMinutesRequest(
                    BASE_DATE.plusDays(3),
                    List.of(firstProposalAttendant.getId())
            );

            // when
            ResultActions result = mockMvc.perform(post("/api/projects/{projectId}/minutes", projectId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
            JsonNode response = readBody(result);
            MinutesEntity savedMinutes = minutesEntityRepository.findById(response.get("minutesId").asLong()).orElseThrow();
            List<MinutesAttendantsInfo> savedAttendants = minutesAttendantEntityRepository
                    .findMemberNamesByMinutesId(savedMinutes.getId()).stream().map(MinutesAttendantsInfo::from).toList();

            // then
            result.andExpect(status().isCreated())
                    .andDo(print());
            assertThat(response.get("host").asText()).isEqualTo(request.host());
            assertThat(response.get("minutesDate").asText()).isEqualTo(request.minutesDate().toString());
            assertThat(response.get("startTime").asText()).isEqualTo(request.startTime().toString());
            assertThat(response.get("endTime").asText()).isEqualTo(request.endTime().toString());
            assertThat(response.get("location").asText()).isEqualTo(request.location());
            assertThat(response.get("purpose").asText()).isEqualTo(request.purpose());
            assertThat(response.get("minutesAttendants")).extracting(
                            node -> node.get("memberId").asText(),
                            node -> node.get("name").asText(),
                            node -> node.get("rank").asText())
                    .containsExactlyInAnyOrder(
                            tuple(String.valueOf(writerProposalAttendant.getId()), writerCompanyMember.getName(), writerCompanyMember.getRank()),
                            tuple(String.valueOf(firstProposalAttendant.getId()), firstAttendant.getName(), firstAttendant.getRank())
                    );
            assertThat(response.get("instAttendants").asText()).isEqualTo(request.instAttendants());
            assertWriter(response, writerProposalAttendant, writerCompanyMember);
            assertThat(response.get("content").asText()).isEqualTo(request.content());
            assertThat(savedAttendants).containsExactlyInAnyOrder(
                            new MinutesAttendantsInfo(writerProposalAttendant.getId(), writerCompanyMember.getName(), writerCompanyMember.getRank()),
                            new MinutesAttendantsInfo(firstProposalAttendant.getId(), firstAttendant.getName(), firstAttendant.getRank())
                    );
        }

        @Test
        @WithMockCustomUser(email = "outsider@test.co.kr")
        @DisplayName("프로젝트 비참여자는 회의록을 생성할 수 없다")
        void 프로젝트_비참여자는_회의록을_생성할_수_없다() throws Exception {
            // given
            MinutesCreateRequest request = createMinutesRequest(
                    BASE_DATE.plusDays(4),
                    List.of(firstProposalAttendant.getId())
            );

            // when & then
            mockMvc.perform(post("/api/projects/{projectId}/minutes", projectId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value(ErrorMessage.NOT_FOUND_ATTENDANT.getMessage()))
                    .andDo(print());
        }
    }

    @Nested
    @DisplayName("회의록 상세 조회")
    class GetMinutesDetail {

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("존재하는 회의록은 상세 조회할 수 있다")
        void 존재하는_회의록은_상세_조회할_수_있다() throws Exception {
            // given
            JsonNode createdMinutes = createMinutesByService(createMinutesRequest(
                    BASE_DATE.plusDays(6),
                    List.of(writerProposalAttendant.getId(), firstProposalAttendant.getId())
            ));
            long minutesId = createdMinutes.get("minutesId").asLong();
            em.flush();
            em.clear();

            // when
            ResultActions result = mockMvc.perform(get("/api/projects/{projectId}/minutes/{minutesId}", projectId, minutesId));
            JsonNode response = readBody(result);

            // then
            result.andExpect(status().isOk())
                    .andDo(print());
            assertThat(response.get("minutesId").asLong()).isEqualTo(minutesId);
            assertThat(response.get("title").asText()).isEqualTo(createdMinutes.get("title").asText());
            assertThat(response.get("host").asText()).isEqualTo("주관부서");
            assertThat(response.get("minutesAttendants")).extracting(
                            node -> node.get("memberId").asText(),
                            node -> node.get("name").asText(),
                            node -> node.get("rank").asText())
                    .containsExactlyInAnyOrder(
                            tuple(String.valueOf(writerProposalAttendant.getId()), writerCompanyMember.getName(), writerCompanyMember.getRank()),
                            tuple(String.valueOf(firstProposalAttendant.getId()), firstAttendant.getName(), firstAttendant.getRank())
                    );
            assertThat(response.get("content").asText()).isEqualTo("회의 내용");
            assertWriter(response, writerProposalAttendant, writerCompanyMember);
        }

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("존재하지 않는 회의록을 조회하면 실패한다")
        void 존재하지_않는_회의록을_조회하면_실패한다() throws Exception {
            // given
            long missingMinutesId = 99999L;

            // when & then
            mockMvc.perform(get("/api/projects/{projectId}/minutes/{minutesId}", projectId, missingMinutesId))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value(ErrorMessage.NOT_FOUND_MINUTES.getMessage()))
                    .andDo(print());
        }
    }

    @Nested
    @DisplayName("회의록 수정")
    class UpdateMinutes {

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("프로젝트 참여자는 회의록의 변경 가능한 정보를 수정할 수 있다")
        void 프로젝트_참여자는_회의록의_변경가능한정보를_수정할_수_있다() throws Exception {
            // given
            JsonNode createdMinutes = createMinutesByService(createMinutesRequest(
                    BASE_DATE.plusDays(1),
                    List.of(firstProposalAttendant.getId())
            ));
            long minutesId = createdMinutes.get("minutesId").asLong();

            String previousMinutesTitle = minutesEntityRepository.findById(minutesId).orElseThrow().getTitle();
            MinutesUpdateRequest request = createMinutesUpdateRequest(
                    BASE_DATE.plusDays(3),
                    LocalTime.of(14, 0),
                    LocalTime.of(15, 30),
                    List.of(firstProposalAttendant.getId()),
                    secondProposalAttendant.getId(),
                    "변경된 주관부서",
                    "변경된 회의 장소",
                    "변경된 회의 목적",
                    "변경된 외부 참석자",
                    "변경된 회의 내용"
            );

            // when
            ResultActions result = mockMvc.perform(patch("/api/projects/{projectId}/minutes/{minutesId}", projectId, minutesId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
            JsonNode response = readBody(result);
            MinutesEntity updatedMinutes = minutesEntityRepository.findById(minutesId).orElseThrow();
            List<MinutesAttendantsInfo> updatedAttendants = minutesAttendantEntityRepository
                    .findMemberNamesByMinutesId(updatedMinutes.getId()).stream().map(MinutesAttendantsInfo::from).toList();

            // then
            result.andExpect(status().isOk()).andDo(print());
            assertThat(response.get("host").asText()).isEqualTo(request.host());
            assertThat(response.get("minutesDate").asText()).isEqualTo(request.minutesDate().toString());
            assertThat(response.get("startTime").asText()).isEqualTo(request.startTime().toString());
            assertThat(response.get("endTime").asText()).isEqualTo(request.endTime().toString());
            assertThat(response.get("location").asText()).isEqualTo(request.location());
            assertThat(response.get("purpose").asText()).isEqualTo(request.purpose());
            assertThat(response.get("instAttendants").asText()).isEqualTo(request.instAttendants());
            assertWriter(response, secondProposalAttendant, secondAttendant);
            assertThat(response.get("content").asText()).isEqualTo(request.content());
            assertThat(response.get("approveId").isNull()).isTrue();
            assertThat(response.get("minutesAttendants")).extracting(
                            node -> node.get("memberId").asText(),
                            node -> node.get("name").asText(),
                            node -> node.get("rank").asText())
                    .containsExactlyInAnyOrder(
                            tuple(String.valueOf(firstProposalAttendant.getId()), firstAttendant.getName(), firstAttendant.getRank()),
                            tuple(String.valueOf(secondProposalAttendant.getId()), secondAttendant.getName(), secondAttendant.getRank())
                    );

            assertThat(updatedMinutes.getHost()).isEqualTo(request.host());
            assertThat(updatedMinutes.getTitle()).isNotEqualTo(previousMinutesTitle);
            assertThat(updatedMinutes.getMinutesDate()).isEqualTo(request.minutesDate());
            assertThat(updatedMinutes.getStartTime()).isEqualTo(request.startTime());
            assertThat(updatedMinutes.getEndTime()).isEqualTo(request.endTime());
            assertThat(updatedMinutes.getLocation()).isEqualTo(request.location());
            assertThat(updatedMinutes.getPurpose()).isEqualTo(request.purpose());
            assertThat(updatedMinutes.getInstAttendants()).isEqualTo(request.instAttendants());
            assertThat(updatedMinutes.getWriter()).isEqualTo(String.valueOf(secondProposalAttendant.getId()));
            assertThat(updatedMinutes.getMeetingContent()).isEqualTo(request.content());
            assertThat(updatedAttendants).containsExactlyInAnyOrder(
                    new MinutesAttendantsInfo(firstProposalAttendant.getId(), firstAttendant.getName(), firstAttendant.getRank()),
                    new MinutesAttendantsInfo(secondProposalAttendant.getId(), secondAttendant.getName(), secondAttendant.getRank())
            );
        }

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("승인서가 연결된 회의록을 수정하면 승인서 정보도 함께 갱신된다")
        void 승인서가_연결된_회의록을_수정하면_승인서_정보도_함께_갱신된다() throws Exception {
            // given
            JsonNode createdMinutes = createMinutesByService(createMinutesRequest(
                    BASE_DATE.plusDays(2),
                    List.of(firstProposalAttendant.getId())
            ));
            long minutesId = createdMinutes.get("minutesId").asLong();
            MinutesEntity createdMinutesEntity = minutesEntityRepository.findById(minutesId).orElseThrow();
            ApproveEntity approve = approveEntityRepository.save(ApproveEntity.from(createdMinutesEntity, BASE_DATE.plusDays(4), writerProposalAttendant.getCompanyMember().getName()));
            String previousReportNo = approve.getReportNo();
            LocalDate updatedMinutesDate = BASE_DATE.plusDays(8);
            LocalDate expectedSubmitDate = BASE_DATE.plusDays(7);
            when(holidayCalculator.calculateSubmitDate(updatedMinutesDate)).thenReturn(expectedSubmitDate);

            MinutesUpdateRequest request = createMinutesUpdateRequest(
                    updatedMinutesDate,
                    LocalTime.of(16, 0),
                    LocalTime.of(17, 0),
                    List.of(firstProposalAttendant.getId()),
                    secondProposalAttendant.getId(),
                    "수정 주관부서",
                    "수정 회의실",
                    "수정 목적",
                    "수정 외부 참석자",
                    "수정된 회의 내용"
            );

            // when
            ResultActions result = mockMvc.perform(patch("/api/projects/{projectId}/minutes/{minutesId}", projectId, minutesId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
            JsonNode response = readBody(result);
            em.flush();
            em.clear();
            MinutesEntity updatedMinutes = minutesEntityRepository.findById(minutesId).orElseThrow();
            ApproveEntity updatedApprove = approveEntityRepository.findById(approve.getId()).orElseThrow();

            // then
            result.andExpect(status().isOk())
                    .andDo(print());
            assertThat(response.get("approveId").asLong()).isEqualTo(approve.getId());
            assertThat(updatedApprove.getReportNo()).isNotEqualTo(previousReportNo);
            assertThat(updatedApprove.getReportNo()).isEqualTo(ApproveEntity.from(updatedMinutes, expectedSubmitDate, writerProposalAttendant.getCompanyMember().getName()).getReportNo());
            assertThat(updatedApprove.getWriteDate()).isEqualTo(expectedSubmitDate);
            assertThat(updatedApprove.getSubmitDate()).isEqualTo(expectedSubmitDate);
            assertThat(updatedApprove.getWriter()).isEqualTo(secondAttendant.getName());
        }
    }

    private void assertWriter(JsonNode response, ProposalAttendantEntity attendantEntity, CompanyMemberEntity companyMember) {
        assertThat(response.get("writer").get("memberId").asText()).isEqualTo(String.valueOf(attendantEntity.getId()));
        assertThat(response.get("writer").get("name").asText()).isEqualTo(String.valueOf(companyMember.getName()));
        assertThat(response.get("writer").get("rank").asText()).isEqualTo(String.valueOf(companyMember.getRank()));
    }

    private MemberEntity createMember(String email, String name, MemberRoleType roleType) {
        return memberRepository.save(
                MemberEntity.builder()
                        .email(email)
                        .name(name)
                        .roleType(roleType)
                        .build()
        );
    }

    private CompanyMemberEntity createCompanyMember(String name) {
        return companyMemberEntityRepository.save(
                CompanyMemberEntity.builder()
                        .name(name)
                        .team("연구기획팀")
                        .rank("사원")
                        .build()
        );
    }

    private ProposalAttendantEntity createProposalAttendants(ProjectEntity project, CompanyMemberEntity companyMember) {
        return proposalAttendantEntityRepository.save(
                ProposalAttendantEntity.builder()
                        .companyMember(companyMember)
                        .project(project)
                        .build()
        );
    }


    private MinutesCreateRequest createMinutesRequest(LocalDate minutesDate, List<Long> minutesAttendants) {
        return new MinutesCreateRequest(
                "주관부서",
                "본관 회의실",
                "주간 점검",
                minutesDate,
                LocalTime.of(10, 0),
                LocalTime.of(11, 0),
                minutesAttendants,
                "외부 참석자",
                writerProposalAttendant.getId(),
                "회의 내용"
        );
    }

    private MinutesUpdateRequest createMinutesUpdateRequest(
            LocalDate minutesDate,
            LocalTime startTime,
            LocalTime endTime,
            List<Long> minutesAttendants,
            Long writerId,
            String host,
            String location,
            String purpose,
            String instAttendants,
            String content
    ) {
        return new MinutesUpdateRequest(
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

    private JsonNode createMinutesByService(MinutesCreateRequest request) throws Exception {
        return objectMapper.valueToTree(minutesServiceApi.createMinutes(projectId, creator.getEmail(), request));
    }

    private JsonNode createMinutesByService(MinutesCreateRequest request, Long projectId) throws Exception {
        return objectMapper.valueToTree(minutesServiceApi.createMinutes(projectId, creator.getEmail(), request));
    }

    private JsonNode readBody(ResultActions result) throws Exception {
        return objectMapper.readTree(result.andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8));
    }

    private List<String> parseNames(String names) {
        return Arrays.stream(names.split(","))
                .map(String::trim)
                .filter(name -> !name.isBlank())
                .toList();
    }
}
