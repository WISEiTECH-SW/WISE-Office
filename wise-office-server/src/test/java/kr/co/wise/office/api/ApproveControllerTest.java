package kr.co.wise.office.api;

import com.fasterxml.jackson.databind.JsonNode;
import kr.co.wise.office.api.dto.approve.ApproveUpdateRequest;
import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.external.hoilday.dto.HolidayCalculator;
import kr.co.wise.office.security.WithMockCustomUser;
import kr.co.wise.office.util.DateUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("ApproveController 통합 테스트")
class ApproveControllerTest extends ApiControllerTestSupport {

    private static final String PROJECT_TITLE = "Approve Project";
    private static final String INSTITUTION = "Institution";
    private static final String BUSINESS_NAME = "Business Name";
    private static final String PROJECT_CONTENT = "Approve project content";

    @MockBean
    private HolidayCalculator holidayCalculator;

    private Long projectId;
    private MemberEntity creator;
    private MemberEntity manager;
    private MemberEntity worker;
    private MemberEntity outsider;

    private CompanyMemberEntity writerCompanyMember;
    private CompanyMemberEntity attendantCompanyMember;

    private ProposalAttendantEntity writerProposalAttendant;
    private ProposalAttendantEntity attendantProposalAttendant;

    @BeforeEach
    void setUp() {
        creator = createMember("creator@test.co.kr", "creator", MemberRoleType.WORKER);
        manager = createMember("manager@test.co.kr", "manager", MemberRoleType.WORKER);
        worker = createMember("worker@test.co.kr", "worker", MemberRoleType.WORKER);
        outsider = createMember("outsider@test.co.kr", "outsider", MemberRoleType.WORKER);

        writerCompanyMember = createCompanyMember("Writer");
        attendantCompanyMember = createCompanyMember("Attendant");

        ProjectFixture projectFixture = createProjectFixture(
                PROJECT_TITLE,
                INSTITUTION,
                BUSINESS_NAME,
                PROJECT_CONTENT,
                creator,
                manager,
                List.of(worker),
                List.of(writerCompanyMember, attendantCompanyMember),
                writerCompanyMember
        );

        projectId = projectFixture.projectId();
        writerProposalAttendant = projectFixture.proposalOf(writerCompanyMember);
        attendantProposalAttendant = projectFixture.proposalOf(attendantCompanyMember);
    }

    @Nested
    @DisplayName("승인서 목록 조회")
    class GetApproveList {

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("프로젝트의 승인서 목록을 최신순으로 조회한다")
        void getApproveList_returnsApprovesInLatestOrder() throws Exception {
            // given
            MinutesEntity firstMinutes = createMinutes(BASE_DATE.plusDays(2));
            ApproveEntity firstApprove = saveApprove(firstMinutes, BASE_DATE.plusDays(1));
            MinutesEntity secondMinutes = createMinutes(BASE_DATE.plusDays(3));
            ApproveEntity secondApprove = saveApprove(secondMinutes, BASE_DATE.plusDays(2));
            em.flush();
            em.clear();

            // when
            ResultActions result = mockMvc.perform(get("/api/projects/{projectId}/approves", projectId));
            JsonNode response = readBody(result);

            // then
            result.andExpect(status().isOk())
                    .andDo(print());
            assertThat(response).hasSize(2);
            assertThat(response.get(0).get("approveId").asLong()).isEqualTo(secondApprove.getId());
            assertThat(response.get(0).get("title").asText()).isEqualTo(secondApprove.getReportNo());
            assertThat(response.get(0).get("submitDate").asText()).isEqualTo(secondApprove.getSubmitDate().format(DateUtil.approveDateFormatter));
            assertThat(response.get(1).get("approveId").asLong()).isEqualTo(firstApprove.getId());
        }

        @Test
        @WithMockCustomUser(email = "outsider@test.co.kr")
        @DisplayName("프로젝트 비참여자도 승인서 목록을 조회할 수 있다")
        void getApproveList_allowsOutsider() throws Exception {
            // given
            MinutesEntity minutes = createMinutes(BASE_DATE.plusDays(4));
            ApproveEntity approve = saveApprove(minutes, BASE_DATE.plusDays(3));
            em.flush();
            em.clear();

            // when
            ResultActions result = mockMvc.perform(get("/api/projects/{projectId}/approves", projectId));
            JsonNode response = readBody(result);

            // then
            result.andExpect(status().isOk())
                    .andDo(print());
            assertThat(response).hasSize(1);
            assertThat(response.get(0).get("approveId").asLong()).isEqualTo(approve.getId());
            assertThat(response.get(0).get("title").asText()).isEqualTo(approve.getReportNo());
        }
    }

    @Nested
    @DisplayName("승인서 생성")
    class CreateApprove {

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("프로젝트 참여자는 회의록으로 승인서를 생성할 수 있다")
        void createApprove_createsApproveFromMinutes() throws Exception {
            // given
            MinutesEntity minutes = createMinutes(BASE_DATE.plusDays(4));
            LocalDate submitDate = BASE_DATE.plusDays(3);
            when(holidayCalculator.calculateSubmitDate(minutes.getMinutesDate())).thenReturn(submitDate);

            // when
            ResultActions result = mockMvc.perform(post("/api/projects/{projectId}/minutes/{minutesId}/approves", projectId, minutes.getId()));
            JsonNode response = readBody(result);
            ApproveEntity savedApprove = approveEntityRepository.findByMinutesIdAndProjectId(minutes.getId(), projectId).orElseThrow();

            // then
            result.andExpect(status().isCreated())
                    .andDo(print());
            assertThat(response.get("approveId").asLong()).isEqualTo(savedApprove.getId());
            assertThat(response.get("minutesId").asLong()).isEqualTo(minutes.getId());
            assertThat(response.get("approveNo").asText()).isEqualTo(savedApprove.getReportNo());
            assertThat(response.get("writtenAt").asText()).isEqualTo(savedApprove.getWriteDate().format(DateUtil.writtenAtDateFormatter));
            assertThat(response.get("writer").asText()).isEqualTo(writerCompanyMember.getName());
            assertThat(response.get("submitAt").asText()).isEqualTo(savedApprove.getSubmitDate().format(DateUtil.writtenAtDateFormatter));
            assertThat(response.get("businessName").asText()).isEqualTo(BUSINESS_NAME);
            assertThat(response.get("title").asText()).isEqualTo(PROJECT_TITLE);
            assertThat(response.get("institution").asText()).isEqualTo(INSTITUTION);
            assertThat(response.get("minutesAt").asText()).isEqualTo(minutes.getMinutesDate().format(DateUtil.approveDateFormatter));
            assertThat(response.get("minutesPurpose").asText()).isEqualTo(minutes.getPurpose());
        }

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("이미 승인서가 있으면 중복 생성할 수 없다")
        void createApprove_withExistingApprove_fails() throws Exception {
            // given
            MinutesEntity minutes = createMinutes(BASE_DATE.plusDays(5));
            saveApprove(minutes, BASE_DATE.plusDays(4));

            // when
            // then
            mockMvc.perform(post("/api/projects/{projectId}/minutes/{minutesId}/approves", projectId, minutes.getId()))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value(ErrorMessage.ALREADY_CREATE_APPROVE.getMessage()))
                    .andDo(print());
        }

        @Test
        @WithMockCustomUser(email = "outsider@test.co.kr")
        @DisplayName("프로젝트 비참여자는 승인서를 생성할 수 없다")
        void createApprove_withOutsider_fails() throws Exception {
            // given
            MinutesEntity minutes = createMinutes(BASE_DATE.plusDays(6));

            // when
            // then
            mockMvc.perform(post("/api/projects/{projectId}/minutes/{minutesId}/approves", projectId, minutes.getId()))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value(ErrorMessage.NOT_FOUND_ATTENDANT.getMessage()))
                    .andDo(print());
        }
    }

    @Nested
    @DisplayName("승인서 상세 조회")
    class GetApproveDetail {

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("승인서 상세 정보를 조회한다")
        void getApproveDetail_returnsApproveDetail() throws Exception {
            // given
            MinutesEntity minutes = createMinutes(BASE_DATE.plusDays(7));
            ApproveEntity approve = saveApprove(minutes, BASE_DATE.plusDays(6));
            em.flush();
            em.clear();

            // when
            ResultActions result = mockMvc.perform(get("/api/projects/{projectId}/approves/{approveId}", projectId, approve.getId()));
            JsonNode response = readBody(result);

            // then
            result.andExpect(status().isOk())
                    .andDo(print());
            assertThat(response.get("approveId").asLong()).isEqualTo(approve.getId());
            assertThat(response.get("minutesId").asLong()).isEqualTo(minutes.getId());
            assertThat(response.get("approveNo").asText()).isEqualTo(approve.getReportNo());
            assertThat(response.get("writtenAt").asText()).isEqualTo(approve.getWriteDate().format(DateUtil.writtenAtDateFormatter));
            assertThat(response.get("writer").asText()).isEqualTo(approve.getWriter());
            assertThat(response.get("submitAt").asText()).isEqualTo(approve.getSubmitDate().format(DateUtil.writtenAtDateFormatter));
            assertThat(response.get("businessName").asText()).isEqualTo(BUSINESS_NAME);
            assertThat(response.get("title").asText()).isEqualTo(PROJECT_TITLE);
            assertThat(response.get("institution").asText()).isEqualTo(INSTITUTION);
            assertThat(response.get("minutesAt").asText()).isEqualTo(minutes.getMinutesDate().format(DateUtil.approveDateFormatter));
            assertThat(response.get("minutesPurpose").asText()).isEqualTo(minutes.getPurpose());
        }

        @Test
        @WithMockCustomUser(email = "outsider@test.co.kr")
        @DisplayName("프로젝트 비참여자도 승인서 상세 정보를 조회할 수 있다")
        void getApproveDetail_allowsOutsider() throws Exception {
            // given
            MinutesEntity minutes = createMinutes(BASE_DATE.plusDays(8));
            ApproveEntity approve = saveApprove(minutes, BASE_DATE.plusDays(7));
            em.flush();
            em.clear();

            // when
            ResultActions result = mockMvc.perform(get("/api/projects/{projectId}/approves/{approveId}", projectId, approve.getId()));
            JsonNode response = readBody(result);

            // then
            result.andExpect(status().isOk())
                    .andDo(print());
            assertThat(response.get("approveId").asLong()).isEqualTo(approve.getId());
            assertThat(response.get("writer").asText()).isEqualTo(approve.getWriter());
        }
    }

    @Nested
    @DisplayName("승인서 수정")
    class UpdateApprove {

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("프로젝트 참여자는 승인서 번호와 작성자를 수정할 수 있다")
        void updateApprove_updatesReportNoAndWriter() throws Exception {
            // given
            MinutesEntity minutes = createMinutes(BASE_DATE.plusDays(9));
            ApproveEntity approve = saveApprove(minutes, BASE_DATE.plusDays(8));
            LocalDate originalWriteDate = approve.getWriteDate();
            LocalDate originalSubmitDate = approve.getSubmitDate();
            ApproveUpdateRequest request = new ApproveUpdateRequest("CUSTOM-APPROVE-NO", "Updated Writer");

            // when
            ResultActions result = mockMvc.perform(patch("/api/projects/{projectId}/approves/{approveId}", projectId, approve.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
            JsonNode response = readBody(result);
            ApproveEntity updatedApprove = approveEntityRepository.findById(approve.getId()).orElseThrow();

            // then
            result.andExpect(status().isOk())
                    .andDo(print());
            assertThat(response.get("approveId").asLong()).isEqualTo(approve.getId());
            assertThat(response.get("reportNo").asText()).isEqualTo(request.reportNo());
            assertThat(response.get("writer").asText()).isEqualTo(request.writer());
            assertThat(updatedApprove.getReportNo()).isEqualTo(request.reportNo());
            assertThat(updatedApprove.getWriter()).isEqualTo(request.writer());
            assertThat(updatedApprove.getWriteDate()).isEqualTo(originalWriteDate);
            assertThat(updatedApprove.getSubmitDate()).isEqualTo(originalSubmitDate);
        }

        @Test
        @WithMockCustomUser(email = "outsider@test.co.kr")
        @DisplayName("프로젝트 비참여자는 승인서를 수정할 수 없다")
        void updateApprove_withOutsider_fails() throws Exception {
            // given
            MinutesEntity minutes = createMinutes(BASE_DATE.plusDays(10));
            ApproveEntity approve = saveApprove(minutes, BASE_DATE.plusDays(9));
            ApproveUpdateRequest request = new ApproveUpdateRequest("CUSTOM-APPROVE-NO", "Updated Writer");

            // when
            // then
            mockMvc.perform(patch("/api/projects/{projectId}/approves/{approveId}", projectId, approve.getId())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value(ErrorMessage.NOT_FOUND_ATTENDANT.getMessage()))
                    .andDo(print());
        }
    }

    private MinutesEntity createMinutes(LocalDate minutesDate) throws Exception {
        return createMinutes(projectId, creator.getEmail(), createMinutesRequest(minutesDate));
    }

    private MinutesCreateRequest createMinutesRequest(LocalDate minutesDate) {
        return createMinutesRequest(
                "Host",
                "Meeting Room",
                "Approve Purpose",
                minutesDate,
                LocalTime.of(10, 0),
                LocalTime.of(11, 0),
                List.of(attendantProposalAttendant.getId()),
                "External attendees",
                writerProposalAttendant.getId(),
                "Approve minutes content"
        );
    }

    private ApproveEntity saveApprove(MinutesEntity minutes, LocalDate submitDate) {
        return saveApprove(minutes, submitDate, writerCompanyMember.getName());
    }
}
