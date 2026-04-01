package kr.co.wise.office.api;

import com.fasterxml.jackson.databind.JsonNode;
import kr.co.wise.office.domain.Project.dto.ProjectCreateRequest;
import kr.co.wise.office.domain.Project.dto.ProjectUpdateRequest;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.Project.repository.ProjectRepository;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantRoleType;
import kr.co.wise.office.domain.attendant.repository.AttendantRepository;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.security.WithMockCustomUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProjectControllerTest extends ApiControllerTestSupport {

    @Autowired
    private AttendantRepository attendantRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private MemberEntity creator;
    private MemberEntity pm;
    private MemberEntity worker1;
    private MemberEntity worker2;
    private CompanyMemberEntity companyMember1;
    private CompanyMemberEntity companyMember2;

    @BeforeEach
    void setUp() {
        creator = createMember("creator@test.co.kr", "Creator", MemberRoleType.WORKER);
        pm = createMember("pm@test.co.kr", "PM", MemberRoleType.WORKER);
        worker1 = createMember("worker1@test.co.kr", "Worker1", MemberRoleType.WORKER);
        worker2 = createMember("worker2@test.co.kr", "Worker2", MemberRoleType.WORKER);
        companyMember1 = createCompanyMember("CompanyMember1");
        companyMember2 = createCompanyMember("CompanyMember2");
    }

    @Nested
    @DisplayName("프로젝트 생성")
    class CreateProject {

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("유효한 요청으로 프로젝트를 생성하면 201과 프로젝트 정보를 반환한다")
        void createProject_withValidRequest_returns201AndProjectInfo() throws Exception {
            // given
            ProjectCreateRequest request = new ProjectCreateRequest(
                    "Test Project", "Institution A", "Business A",
                    BASE_DATE, BASE_DATE.plusDays(30), "Project content",
                    pm.getId(),
                    List.of(worker1.getId()),
                    List.of(companyMember1.getId(), companyMember2.getId()),
                    companyMember1.getId()
            );

            // when
            ResultActions result = mockMvc.perform(post("/api/v1/projects")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
            JsonNode response = readBody(result);

            // then
            result.andExpect(status().isCreated()).andDo(print());
            assertThat(response.get("projectId").asLong()).isPositive();
            assertThat(response.get("projectTitle").asText()).isEqualTo("Test Project");
            assertThat(response.get("institution").asText()).isEqualTo("Institution A");
            assertThat(response.get("businessName").asText()).isEqualTo("Business A");
            assertThat(response.get("managerName").asText()).isEqualTo(pm.getName());
            // attendant = worker1 + creator (creator != pm이므로 creator도 포함)
            assertThat(response.get("attendant")).hasSize(2);
            assertThat(response.get("proposalAttendant")).hasSize(2);
        }

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("프로젝트 생성 시 CREATOR, PM, WORKER 역할로 참여자가 등록된다")
        void createProject_registersAttendantsWithCorrectRoles() throws Exception {
            // given
            ProjectCreateRequest request = new ProjectCreateRequest(
                    "Test Project", "Institution", "Business",
                    BASE_DATE, BASE_DATE.plusDays(30), "Content",
                    pm.getId(),
                    List.of(worker1.getId()),
                    List.of(companyMember1.getId()),
                    companyMember1.getId()
            );

            // when
            ResultActions result = mockMvc.perform(post("/api/v1/projects")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
            long projectId = readBody(result).get("projectId").asLong();
            em.flush();
            em.clear();

            // then
            result.andExpect(status().isCreated());
            ProjectEntity project = projectRepository.findById(projectId).orElseThrow();
            List<AttendantEntity> attendants = attendantRepository.findAttendantsByProjectIdWithMember(project);

            assertThat(attendants).hasSize(3);
            assertThat(attendants).anyMatch(a -> a.hasRole(AttendantRoleType.CREATOR) && a.getMember().getId().equals(creator.getId()));
            assertThat(attendants).anyMatch(a -> a.hasRole(AttendantRoleType.PM) && a.getMember().getId().equals(pm.getId()));
            assertThat(attendants).anyMatch(a -> a.hasRole(AttendantRoleType.WORKER) && a.getMember().getId().equals(worker1.getId()));
        }

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("PM과 CREATOR가 동일하면 CREATOR row와 PM row가 각각 저장된다")
        void createProject_whenPMisCreator_savesCREATORandPMRows() throws Exception {
            // given - creator가 PM을 겸하는 경우
            ProjectCreateRequest request = new ProjectCreateRequest(
                    "Test Project", "Institution", "Business",
                    BASE_DATE, BASE_DATE.plusDays(30), "Content",
                    creator.getId(),  // PM = creator
                    List.of(worker1.getId()),
                    List.of(companyMember1.getId()),
                    companyMember1.getId()
            );

            // when
            ResultActions result = mockMvc.perform(post("/api/v1/projects")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
            JsonNode response = readBody(result);
            long projectId = response.get("projectId").asLong();
            em.flush();
            em.clear();

            // then
            result.andExpect(status().isCreated());
            // creator == pm이므로 attendant = [worker1] (creator 이름 중복 미포함)
            assertThat(response.get("attendant")).hasSize(1);

            ProjectEntity project = projectRepository.findById(projectId).orElseThrow();
            List<AttendantEntity> attendants = attendantRepository.findAttendantsByProjectIdWithMember(project);

            // 동일 멤버라도 CREATOR row / PM row 별도 저장
            assertThat(attendants).hasSize(3);
            assertThat(attendants).anyMatch(a -> a.hasRole(AttendantRoleType.CREATOR) && a.getMember().getId().equals(creator.getId()));
            assertThat(attendants).anyMatch(a -> a.hasRole(AttendantRoleType.PM) && a.getMember().getId().equals(creator.getId()));
            assertThat(attendants).anyMatch(a -> a.hasRole(AttendantRoleType.WORKER) && a.getMember().getId().equals(worker1.getId()));
        }
    }

    @Nested
    @DisplayName("프로젝트 수정")
    class UpdateProject {

        private long projectId;

        @BeforeEach
        void setUpProject() {
            // 초기 구조: CREATOR(creator), PM(pm), WORKER(worker1)
            projectId = projectServiceApiV2.createProject(
                    new ProjectCreateRequest(
                            "Original Title", "Original Institution", "Original Business",
                            BASE_DATE, BASE_DATE.plusDays(10), "Original Content",
                            pm.getId(),
                            List.of(worker1.getId()),
                            List.of(companyMember1.getId(), companyMember2.getId()),
                            companyMember1.getId()
                    ),
                    creator.getEmail()
            ).getProjectId();
        }

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("CREATOR는 프로젝트 기본 정보를 수정하면 200과 변경된 정보를 반환한다")
        void updateProject_byCreator_updatesBasicInfo() throws Exception {
            // given
            ProjectUpdateRequest request = new ProjectUpdateRequest(
                    "Updated Title", "Updated Institution", "Updated Business",
                    BASE_DATE.plusDays(5), BASE_DATE.plusDays(20), "Updated Content",
                    pm.getId(),
                    List.of(creator.getId(), worker1.getId()),
                    List.of(companyMember1.getId(), companyMember2.getId()),
                    companyMember1.getId()
            );

            // when
            ResultActions result = mockMvc.perform(patch("/api/v1/projects/{projectId}", projectId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
            JsonNode response = readBody(result);

            // then
            result.andExpect(status().isOk()).andDo(print());
            assertThat(response.get("projectTitle").asText()).isEqualTo("Updated Title");
            assertThat(response.get("institution").asText()).isEqualTo("Updated Institution");
            assertThat(response.get("businessName").asText()).isEqualTo("Updated Business");
            assertThat(response.get("start").asText()).isEqualTo(BASE_DATE.plusDays(5).toString());
            assertThat(response.get("end").asText()).isEqualTo(BASE_DATE.plusDays(20).toString());
            assertThat(response.get("detail").asText()).isEqualTo("Updated Content");
            assertThat(response.get("canModify").asBoolean()).isTrue();
        }

        @Test
        @WithMockCustomUser(email = "pm@test.co.kr")
        @DisplayName("PM도 프로젝트를 수정할 수 있다")
        void updateProject_byPM_updatesInfo() throws Exception {
            // given
            ProjectUpdateRequest request = new ProjectUpdateRequest(
                    "PM Updated Title", "Original Institution", "Original Business",
                    BASE_DATE, BASE_DATE.plusDays(10), "Original Content",
                    pm.getId(),
                    List.of(creator.getId(), worker1.getId()),
                    List.of(companyMember1.getId(), companyMember2.getId()),
                    companyMember1.getId()
            );

            // when
            ResultActions result = mockMvc.perform(patch("/api/v1/projects/{projectId}", projectId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
            JsonNode response = readBody(result);

            // then
            result.andExpect(status().isOk()).andDo(print());
            assertThat(response.get("projectTitle").asText()).isEqualTo("PM Updated Title");
            assertThat(response.get("canModify").asBoolean()).isTrue();
        }

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("참여자를 교체하면 기존 참여자는 탈퇴 처리되고 신규 참여자가 등록된다")
        void updateProject_replacesAttendants() throws Exception {
            // given - worker1 제거, worker2 추가
            ProjectUpdateRequest request = new ProjectUpdateRequest(
                    "Original Title", "Original Institution", "Original Business",
                    BASE_DATE, BASE_DATE.plusDays(10), "Original Content",
                    pm.getId(),
                    List.of(creator.getId(), worker2.getId()),  // worker1 → worker2
                    List.of(companyMember1.getId(), companyMember2.getId()),
                    companyMember1.getId()
            );

            // when
            mockMvc.perform(patch("/api/v1/projects/{projectId}", projectId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());
            em.flush();
            em.clear();

            // then
            ProjectEntity project = projectRepository.findById(projectId).orElseThrow();
            List<AttendantEntity> activeAttendants = attendantRepository.findAttendantsByProjectIdWithMember(project);

            assertThat(activeAttendants).anyMatch(a -> a.getMember().getId().equals(worker2.getId()) && a.hasRole(AttendantRoleType.WORKER));
            assertThat(activeAttendants).noneMatch(a -> a.getMember().getId().equals(worker1.getId()));
        }

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("기존 WORKER를 PM으로 지정하면 역할이 변경되고 기존 PM은 WORKER가 된다")
        void updateProject_promotesWorkerToPM() throws Exception {
            // given - worker1 → 새 PM, pm → WORKER
            ProjectUpdateRequest request = new ProjectUpdateRequest(
                    "Original Title", "Original Institution", "Original Business",
                    BASE_DATE, BASE_DATE.plusDays(10), "Original Content",
                    worker1.getId(),  // 기존 WORKER → 새 PM
                    List.of(creator.getId(), pm.getId()),  // 기존 PM → WORKER
                    List.of(companyMember1.getId(), companyMember2.getId()),
                    companyMember1.getId()
            );

            // when
            ResultActions result = mockMvc.perform(patch("/api/v1/projects/{projectId}", projectId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
            JsonNode response = readBody(result);
            em.flush();
            em.clear();

            // then
            result.andExpect(status().isOk()).andDo(print());
            assertThat(response.get("managerName").get("name").asText()).isEqualTo(worker1.getName());

            ProjectEntity project = projectRepository.findById(projectId).orElseThrow();
            List<AttendantEntity> activeAttendants = attendantRepository.findAttendantsByProjectIdWithMember(project);

            assertThat(activeAttendants).anyMatch(a -> a.hasRole(AttendantRoleType.PM) && a.getMember().getId().equals(worker1.getId()));
            assertThat(activeAttendants).anyMatch(a -> a.hasRole(AttendantRoleType.WORKER) && a.getMember().getId().equals(pm.getId()));
        }

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("기존 PM이 새 목록에 없으면 탈퇴 처리되고 새 PM이 외부에서 추가된다")
        void updateProject_whenOldPMNotInNewList_deactivatesOldPMAndInsertsNewPM() throws Exception {
            // given - pm 완전 탈퇴, worker2(기존 미참여)가 신규 PM
            ProjectUpdateRequest request = new ProjectUpdateRequest(
                    "Original Title", "Original Institution", "Original Business",
                    BASE_DATE, BASE_DATE.plusDays(10), "Original Content",
                    worker2.getId(),  // 기존에 없던 외부인이 PM
                    List.of(creator.getId(), worker1.getId()),  // pm은 목록에서 제외
                    List.of(companyMember1.getId(), companyMember2.getId()),
                    companyMember1.getId()
            );

            // when
            mockMvc.perform(patch("/api/v1/projects/{projectId}", projectId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());
            em.flush();
            em.clear();

            // then
            ProjectEntity project = projectRepository.findById(projectId).orElseThrow();
            List<AttendantEntity> activeAttendants = attendantRepository.findAttendantsByProjectIdWithMember(project);

            // 기존 PM은 활성 목록에서 제거됨
            assertThat(activeAttendants).noneMatch(a -> a.getMember().getId().equals(pm.getId()));
            // 새 PM(외부인)이 PM 역할로 신규 등록됨
            assertThat(activeAttendants).anyMatch(a -> a.hasRole(AttendantRoleType.PM) && a.getMember().getId().equals(worker2.getId()));
        }

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("CREATOR가 새 참여자 목록에 없으면 탈퇴 처리된다")
        void updateProject_whenCreatorNotInNewList_deactivatesCREATORRow() throws Exception {
            // given - creator를 attendants에서 제외
            ProjectUpdateRequest request = new ProjectUpdateRequest(
                    "Original Title", "Original Institution", "Original Business",
                    BASE_DATE, BASE_DATE.plusDays(10), "Original Content",
                    pm.getId(),
                    List.of(worker1.getId()),  // creator 제외
                    List.of(companyMember1.getId(), companyMember2.getId()),
                    companyMember1.getId()
            );

            // when
            mockMvc.perform(patch("/api/v1/projects/{projectId}", projectId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());
            em.flush();
            em.clear();

            // then
            ProjectEntity project = projectRepository.findById(projectId).orElseThrow();
            List<AttendantEntity> activeAttendants = attendantRepository.findAttendantsByProjectIdWithMember(project);

            assertThat(activeAttendants).noneMatch(a -> a.getMember().getId().equals(creator.getId()));
        }

        @Test
        @WithMockCustomUser(email = "creator@test.co.kr")
        @DisplayName("CREATOR와 PM이 같은 사람이었다가 PM을 교체하면 PM row만 탈퇴되고 CREATOR row는 유지된다")
        void updateProject_whenCreatorWasAlsoPM_onlyPMRowDeactivated() throws Exception {
            // given - creator가 PM을 겸하는 프로젝트 별도 생성
            long creatorPMProjectId = projectServiceApiV2.createProject(
                    new ProjectCreateRequest(
                            "Creator-PM Project", "Institution", "Business",
                            BASE_DATE, BASE_DATE.plusDays(10), "Content",
                            creator.getId(),  // PM = creator (CREATOR+PM 동일인)
                            List.of(worker1.getId()),
                            List.of(companyMember1.getId()),
                            companyMember1.getId()
                    ),
                    creator.getEmail()
            ).getProjectId();

            // PM을 pm으로 교체, creator는 attendants에 포함해 CREATOR 유지
            ProjectUpdateRequest request = new ProjectUpdateRequest(
                    "Creator-PM Project", "Institution", "Business",
                    BASE_DATE, BASE_DATE.plusDays(10), "Content",
                    pm.getId(),  // 새 PM
                    List.of(creator.getId(), worker1.getId()),  // creator는 잔류
                    List.of(companyMember1.getId()),
                    companyMember1.getId()
            );

            // when
            mockMvc.perform(patch("/api/v1/projects/{projectId}", creatorPMProjectId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());
            em.flush();
            em.clear();

            // then
            ProjectEntity project = projectRepository.findById(creatorPMProjectId).orElseThrow();
            List<AttendantEntity> activeAttendants = attendantRepository.findAttendantsByProjectIdWithMember(project);

            // creator의 CREATOR row는 살아있음
            assertThat(activeAttendants).anyMatch(a -> a.hasRole(AttendantRoleType.CREATOR) && a.getMember().getId().equals(creator.getId()));
            // creator의 PM row는 탈퇴됨 (active 목록에 PM 역할로 creator 없음)
            assertThat(activeAttendants).noneMatch(a -> a.hasRole(AttendantRoleType.PM) && a.getMember().getId().equals(creator.getId()));
            // 새 PM이 등록됨
            assertThat(activeAttendants).anyMatch(a -> a.hasRole(AttendantRoleType.PM) && a.getMember().getId().equals(pm.getId()));
        }
    }
}
