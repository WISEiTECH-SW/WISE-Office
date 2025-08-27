package kr.co.wise.office.application;

import kr.co.wise.office.domain.Project.dto.ProjectCreateRequest;
import kr.co.wise.office.domain.Project.dto.ProjectCreateResponse;
import kr.co.wise.office.domain.Project.dto.ProjectDetailResponse;
import kr.co.wise.office.domain.Project.dto.ProjectUpdateRequest;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantRoleType;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import kr.co.wise.office.exception.custom.UnAuthorizationException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

public class ProjectServiceApiV2Test extends BaseTestEntity {

    @Autowired
    private ProjectServiceApiV2 projectServiceApiV2;

    private static final LocalDate BASE_DATE = LocalDate.of(2025, 1, 1);

    @Test
    @DisplayName("프로젝트 생성 성공 시, PM/Creator/Workers가 올바르게 저장된다")
    void createProject_success() {
        // given
        MemberEntity creator = createMember("creator@test.com", "Creator");
        MemberEntity pm = createMember("pm@test.com", "PM");
        MemberEntity worker1 = createMember("worker1@test.com", "Worker1");
        MemberEntity worker2 = createMember("worker2@test.com", "Worker2");

        ProjectCreateRequest request = createProjectRequest(
                "Project Title Test",
                "Project Content Test",
                pm.getId(),
                List.of(worker1.getId(), worker2.getId())
        );

        // when
        ProjectCreateResponse response = projectServiceApiV2.createProjectV2(request, creator.getEmail());

        // then
        assertThat(response).isNotNull();
        assertThat(response.getProjectTitle()).isEqualTo("Project Title Test");
        assertThat(response.getManagerName()).isEqualTo(pm.getName());

        ProjectEntity createdProject = projectRepository.findAll().get(1);
        assertThat(createdProject.getTitle()).isEqualTo("Project Title Test");

        List<AttendantEntity> attendants = attendantRepository.findAttendantsByProjectIdWithMember(createdProject);
        assertThat(attendants).hasSize(4);

        assertThat(attendants).as("PM이 등록되어야 한다")
                .anyMatch(a -> a.getMember().getId().equals(pm.getId()) && a.getRole() == AttendantRoleType.PM);

        assertThat(attendants).as("Creator가 등록되어야 한다")
                .anyMatch(a -> a.getMember().getId().equals(creator.getId()) && a.getRole() == AttendantRoleType.CREATOR);

        long workerCount = attendants.stream().filter(att -> att.getRole() == AttendantRoleType.WORKER).count();
        assertThat(workerCount).as("Worker 2명이 등록되어야 한다").isEqualTo(2);
    }

    @Test
    @DisplayName("PM이 프로젝트 수정 성공 시, PM 교체 및 참여자 정보가 올바르게 반영된다")
    void updateProject_success() {
        // given
        MemberEntity creator = createMember("creator@test.com", "Creator");
        MemberEntity initialPm = createMember("initialPm@test.com", "InitialPM");
        MemberEntity newWorker = createMember("newWorker1@test.com", "newWorker1");

        ProjectCreateResponse createResponse = projectServiceApiV2.createProjectV2(
                createProjectRequest("Initial Title", "Initial Content", initialPm.getId(), List.of()),
                creator.getEmail());
        long projectId = createResponse.getProjectId();

        MemberEntity newPm = createMember("newPm@test.com", "NewPM");
        ProjectUpdateRequest updateRequest = new ProjectUpdateRequest("Updated Title",
                BASE_DATE.plusDays(1),
                BASE_DATE.plusDays(20),
                "Updated Content",
                newPm.getId(),
                List.of(creator.getId(), newWorker.getId()));

        // when
        projectServiceApiV2.updateProject(projectId, initialPm.getEmail(), updateRequest);

        // then
        ProjectEntity updatedProject = projectRepository.findById(projectId).orElseThrow();
        assertThat(updatedProject.getTitle()).isEqualTo("Updated Title");
        assertThat(updatedProject.getDetail()).isEqualTo("Updated Content");

        List<AttendantEntity> attendants = attendantRepository.findAttendantsByProjectIdWithMember(updatedProject);
        assertThat(attendants).as("새로운 PM이 정상적으로 반영되어야 한다")
                .anyMatch(a -> a.getMember().getId().equals(newPm.getId()) && a.getRole() == AttendantRoleType.PM && a.getLeftAt() == null);
        assertThat(attendants).as("이전 PM은 더 이상 활동 중이지 않아야 한다")
                .noneMatch(a -> a.getMember().getId().equals(initialPm.getId()) && a.getRole() == AttendantRoleType.PM && a.getLeftAt() == null);

        long activeCount = attendants.stream().filter(a -> a.getLeftAt() == null).count();
        assertThat(activeCount).as("Creator와 NewPM, newWorker 세 명만 참여 중이어야 한다").isEqualTo(3);
    }

    @Test
    @DisplayName("PM이 프로젝트 종료 성공 시, 모든 참여자가 leftAt이 설정된다")
    void closeProject_success() {
        // given
        MemberEntity creator = createMember("creator@test.com", "Creator");
        MemberEntity pm = createMember("pm@test.com", "PM");

        ProjectCreateResponse createResponse = projectServiceApiV2.createProjectV2(
                createProjectRequest("To Be Closed", "Content", pm.getId(), List.of()),
                creator.getEmail()
        );
        long projectId = createResponse.getProjectId();

        // when
        projectServiceApiV2.closeProject(projectId, pm.getEmail());

        // then
        ProjectEntity closedProject = projectRepository.findById(projectId).orElseThrow();
        assertThat(closedProject.isClosed()).isTrue();

        List<AttendantEntity> attendants = attendantRepository.findAttendantsByProjectIdWithMember(closedProject);
        assertThat(attendants).as("프로젝트 종료 시 모든 참여자가 떠나야 한다").allMatch(a -> a.getLeftAt() != null);
    }

    @Test
    @DisplayName("프로젝트에 참여하지 않은 사람이 프로젝트 수정 시도 시 예외 발생")
    void updateProject_withUnauthorizedUser_shouldThrowException() {
        // given
        MemberEntity creator = createMember("creator@test.com", "Creator");
        MemberEntity pm = createMember("pm@test.com", "PM");

        ProjectCreateResponse createResponse = projectServiceApiV2.createProjectV2(
                createProjectRequest("Title", "Content", pm.getId(), List.of()),
                creator.getEmail());

        long projectId = createResponse.getProjectId();
        MemberEntity outsider = createMember("outsider@test.com", "Outsider");

        ProjectUpdateRequest updateRequest = new ProjectUpdateRequest(
                "Updated Title",
                BASE_DATE.plusDays(1),
                BASE_DATE.plusDays(20),
                "Updated Content",
                pm.getId(),
                List.of(creator.getId()));

        // when & then
        assertThatThrownBy(() -> projectServiceApiV2.updateProject(projectId, outsider.getEmail(), updateRequest))
                .isInstanceOf(NotFoundResourceException.class)
                .extracting("errorMessage").extracting("message")
                .isEqualTo(ErrorMessage.NOT_FOUND_ATTENDANT.getMessage());
    }

    @Test
    @DisplayName("프로젝트에 참여하지 않은 사람이 프로젝트 삭제 시도 시 예외 발생")
    void closeProject_withUnauthorizedUser_shouldThrowException() {
        // given
        MemberEntity creator = createMember("creator@test.com", "Creator");
        MemberEntity pm = createMember("pm@test.com", "PM");

        ProjectCreateResponse createResponse = projectServiceApiV2.createProjectV2(
                createProjectRequest("Title", "Content", pm.getId(), List.of()),
                creator.getEmail()
        );

        long projectId = createResponse.getProjectId();
        MemberEntity outsider = createMember("outsider@test.com", "Outsider");

        assertThatThrownBy(() -> projectServiceApiV2.closeProject(projectId, outsider.getEmail()))
                .isInstanceOf(NotFoundResourceException.class)
                .extracting("errorMessage").extracting("message")
                .isEqualTo(ErrorMessage.NOT_FOUND_ATTENDANT.getMessage());
    }

    @Test
    @DisplayName("WORKER가 프로젝트 종료시 예외 발생")
    void closeProject_withWorkerUser_shouldThrowException(){
        // given
        MemberEntity creator = createMember("creator@test.com", "Creator");
        MemberEntity pm = createMember("pm@test.com", "PM");
        MemberEntity worker = createMember("worker@test.com", "worker");

        ProjectCreateResponse createResponse = projectServiceApiV2.createProjectV2(
                createProjectRequest("Title", "Content", pm.getId(), List.of(worker.getId())),
                creator.getEmail()
        );

        long projectId = createResponse.getProjectId();


        assertThatThrownBy(() -> projectServiceApiV2.closeProject(projectId, worker.getEmail()))
                .isInstanceOf(UnAuthorizationException.class)
                .extracting("errorMessage").extracting("message")
                .isEqualTo(ErrorMessage.REJECT_MODIFYING_PROJECT.getMessage());
    }

    @Test
    @DisplayName("WORKER가 프로젝트 수정시 예외 발생")
    void updateProject_withWorkerUser_shouldThrowException(){
        // given
        MemberEntity creator = createMember("creator@test.com", "Creator");
        MemberEntity pm = createMember("pm@test.com", "PM");
        MemberEntity worker = createMember("worker@test.com", "worker");

        ProjectCreateResponse createResponse = projectServiceApiV2.createProjectV2(
                createProjectRequest("Title", "Content", pm.getId(), List.of(worker.getId())),
                creator.getEmail()
        );
        long projectId = createResponse.getProjectId();

        //when
        ProjectUpdateRequest updateRequest = new ProjectUpdateRequest(
                "Updated Title",
                BASE_DATE.plusDays(1),
                BASE_DATE.plusDays(20),
                "Updated Content",
                worker.getId(),
                List.of(creator.getId()));

        //then
        assertThatThrownBy(() -> projectServiceApiV2.updateProject(projectId, worker.getEmail(), updateRequest))
                .isInstanceOf(UnAuthorizationException.class)
                .extracting("errorMessage").extracting("message")
                .isEqualTo(ErrorMessage.REJECT_MODIFYING_PROJECT.getMessage());;
    }

    @Test
    @DisplayName("ADMIN 권한을 가진 유저는 참여하지 않은 프로젝트 업데이트가 가능함.")
    void updateProject_withAdminUser_shouldUpdatePossible() {
        // given
        MemberEntity creator = createMember("creator@test.com", "Creator");
        MemberEntity pm = createMember("pm@test.com", "PM");
        MemberEntity worker = createMember("worker@test.com", "worker");
        MemberEntity admin = memberRepository.save(MemberEntity.builder()
                .name("admin").email("admin@test.com").roleType(MemberRoleType.MASTER).build());

        ProjectCreateResponse createResponse = projectServiceApiV2.createProjectV2(
                createProjectRequest("Title", "Content", pm.getId(), List.of()),
                creator.getEmail()
        );

        //when
        ProjectUpdateRequest updateRequest = new ProjectUpdateRequest(
                "Updated Title",
                BASE_DATE.plusDays(1),
                BASE_DATE.plusDays(20),
                "Updated Content",
                worker.getId(),
                List.of(creator.getId()));
        ProjectDetailResponse updateResponse = projectServiceApiV2
                .updateProject(createResponse.getProjectId(), creator.getEmail(), updateRequest);
        List<AttendantEntity> updateAttendants = attendantRepository
                .findAllWithMemberAndProject(List.of(updateResponse.getProjectId())).orElseThrow();

        //then
        assertThat(updateResponse.getProjectTitle()).isEqualTo(updateRequest.projectTitle());
        assertThat(updateResponse.getManagerName().name()).isEqualTo(worker.getName());
        final int managerCount = 1;
        assertThat(updateResponse.getAttendant().size() + managerCount).isEqualTo(updateAttendants.size());
    }

    @Test
    @DisplayName("ADMIN 권한을 가진 유저는 참여하지 않은 프로젝트 종료가 가능함.")
    void closeProject_withAdminUser_shouldCloseProject() {
        // given
        MemberEntity creator = createMember("creator@test.com", "Creator");
        MemberEntity pm = createMember("pm@test.com", "PM");
        MemberEntity worker = createMember("worker@test.com", "worker");
        MemberEntity admin = memberRepository.save(MemberEntity.builder()
                .name("admin").email("admin@test.com").roleType(MemberRoleType.MASTER).build());

        ProjectCreateResponse createResponse = projectServiceApiV2.createProjectV2(
                createProjectRequest("Title", "Content", pm.getId(), List.of(worker.getId())),
                creator.getEmail()
        );
        long projectId = createResponse.getProjectId();

        //when + then
        Assertions.assertDoesNotThrow(() -> projectServiceApiV2.closeProject(projectId, admin.getEmail()));
        //then
        List<AttendantEntity> attendantEntities = attendantRepository.findAllWithMemberAndProject(List.of(projectId)).orElseThrow();
        ProjectEntity project = projectRepository.findById(projectId).orElseThrow();
        assertThat(attendantEntities.size()).as("종료된 프로젝트에서는 참여자가 0명으로 조회되어야 함").isEqualTo(0);
        assertThat(project.isClosed()).as("종료된 프로젝트는 종료 표시가 되어 있어야 함").isTrue();
    }
}