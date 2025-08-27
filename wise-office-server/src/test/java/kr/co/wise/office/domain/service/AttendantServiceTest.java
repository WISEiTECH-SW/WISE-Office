package kr.co.wise.office.domain.service;

import kr.co.wise.office.domain.Project.dto.ProjectListResponse;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantRoleType;
import kr.co.wise.office.domain.attendant.repository.AttendantRepository;
import kr.co.wise.office.domain.attendant.service.AttendantService;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AttendantServiceTest {

    @InjectMocks
    private AttendantService attendantService;

    @Mock
    private AttendantRepository attendantRepository;

    @DisplayName("CREATOR, PM, WORKER가 모두 다른 경우, 각 역할에 맞게 참여자가 생성된다.")
    @Test
    void makeAttendantsV2_AllDistinctRoles() {
        // given
        MemberEntity creator = mock(MemberEntity.class);
        lenient().when(creator.getId()).thenReturn(1L);
        lenient().when(creator.getName()).thenReturn("Creator");

        MemberEntity pm = mock(MemberEntity.class);
        lenient().when(pm.getId()).thenReturn(2L);
        lenient().when(pm.getName()).thenReturn("PM");

        MemberEntity worker1 = mock(MemberEntity.class);
        lenient().when(worker1.getId()).thenReturn(3L);
        MemberEntity worker2 = mock(MemberEntity.class);
        lenient().when(worker2.getId()).thenReturn(4L);

        List<MemberEntity> workers = List.of(worker1, worker2);
        ProjectEntity project = mock(ProjectEntity.class);

        ArgumentCaptor<AttendantEntity> attendantCaptor = ArgumentCaptor.forClass(AttendantEntity.class);
        ArgumentCaptor<List<AttendantEntity>> attendantsCaptor = ArgumentCaptor.forClass(List.class);

        // when
        attendantService.makeAttendantsV2(creator, pm, workers, project);

        // then
        // 1. CREATOR와 PM이 각각 save 되는지 확인
        verify(attendantRepository, times(2)).save(attendantCaptor.capture());
        List<AttendantEntity> savedAttendants = attendantCaptor.getAllValues();
        assertThat(savedAttendants).hasSize(2);
        assertThat(savedAttendants).extracting(AttendantEntity::getRole).containsExactlyInAnyOrder(AttendantRoleType.CREATOR, AttendantRoleType.PM);

        // 2. WORKER들이 saveAll로 저장되는지 확인
        verify(attendantRepository, times(1)).saveAll(attendantsCaptor.capture());
        List<AttendantEntity> savedWorkers = attendantsCaptor.getValue();
        assertThat(savedWorkers).hasSize(2);
        assertThat(savedWorkers).extracting(AttendantEntity::getRole).containsOnly(AttendantRoleType.WORKER);
    }

    @DisplayName("PM과 Creator가 동일인물일 경우, 반환되는 참여자 이름 목록에 중복이 없다.")
    @Test
    void makeAttendantsV2_SameCreatorAndPM() {
        // given
        MemberEntity sameUser = mock(MemberEntity.class);
        lenient().when(sameUser.getId()).thenReturn(1L);
        lenient().when(sameUser.getName()).thenReturn("SameUser");

        MemberEntity worker1 = mock(MemberEntity.class);
        lenient().when(worker1.getId()).thenReturn(3L);
        lenient().when(worker1.getName()).thenReturn("Worker1");

        MemberEntity worker2 = mock(MemberEntity.class);
        lenient().when(worker2.getId()).thenReturn(4L);
        lenient().when(worker2.getName()).thenReturn("Worker2");

        List<MemberEntity> workers = List.of(worker1, worker2);
        ProjectEntity project = mock(ProjectEntity.class);

        // when
        List<String> attendantNames = attendantService.makeAttendantsV2(sameUser, sameUser, workers, project);

        // then
        // PM과 Creator가 같으므로, 반환되는 이름 목록에는 worker1, worker2만 있어야 함
        assertThat(attendantNames).hasSize(2);
        assertThat(attendantNames).containsExactly("Worker1", "Worker2");
        // PM save, Creator save
        verify(attendantRepository, times(2)).save(any(AttendantEntity.class));
        // worker save
        verify(attendantRepository, times(1)).saveAll(anyList());
    }

    @DisplayName("프로젝트 참여자가 아닐 경우 NotFoundResourceException 예외가 발생한다.")
    @Test
    void validateParticipatingProject_NotParticipant_ShouldThrowException() {
        // given
        MemberEntity user = mock(MemberEntity.class);
        ProjectEntity project = mock(ProjectEntity.class);
        when(attendantRepository.findByMemberAndProject(user, project)).thenReturn(List.of());

        // when & then
        assertThatThrownBy(() -> attendantService.validateParticipatingProject(user, project))
                .isInstanceOf(NotFoundResourceException.class)
                .extracting("errorMessage")
                .extracting("message")
                .isEqualTo(ErrorMessage.NOT_FOUND_ATTENDANT.getMessage());
    }

    @DisplayName("프로젝트 참여자일 경우 해당 참여자 정보를 반환한다.")
    @Test
    void validateParticipatingProject_Participant_ShouldReturnAttendant() {
        // given
        MemberEntity user = mock(MemberEntity.class);
        ProjectEntity project = mock(ProjectEntity.class);
        AttendantEntity attendant = AttendantEntity.builder().role(AttendantRoleType.WORKER).build();
        when(attendantRepository.findByMemberAndProject(user, project)).thenReturn(List.of(attendant));

        // when
        AttendantEntity result = attendantService.validateParticipatingProject(user, project);

        // then
        assertThat(result).isEqualTo(attendant);
    }

    @DisplayName("사용자가 PM과 CREATOR 역할을 모두 가질 경우, PM 권한을 우선하여 반환한다.")
    @Test
    void validateParticipatingProject_DualRole_ShouldReturnPMAttendant() {
        // given
        MemberEntity user = mock(MemberEntity.class);
        ProjectEntity project = mock(ProjectEntity.class);
        AttendantEntity creatorAttendant = AttendantEntity.builder().role(AttendantRoleType.CREATOR).build();
        AttendantEntity pmAttendant = AttendantEntity.builder().role(AttendantRoleType.PM).build();
        when(attendantRepository.findByMemberAndProject(user, project)).thenReturn(List.of(creatorAttendant, pmAttendant));

        // when
        AttendantEntity result = attendantService.validateParticipatingProject(user, project);

        // then
        assertThat(result.getRole()).isEqualTo(AttendantRoleType.PM);
    }

    @DisplayName("읽기용 - 프로젝트 참여자가 아닐 경우, 예외 없이 기본 WORKER 역할 객체를 반환한다.")
    @Test
    void validateParticipatingProjectForViewing_NotParticipant_ShouldReturnDefault() {
        // given
        MemberEntity user = mock(MemberEntity.class);
        ProjectEntity project = mock(ProjectEntity.class);
        when(attendantRepository.findByMemberAndProject(user, project)).thenReturn(List.of());

        // when
        AttendantEntity result = attendantService.validateParticipatingProjectForViewing(user, project);

        // then
        assertThat(result.getRole()).isEqualTo(AttendantRoleType.WORKER);
    }

    @DisplayName("프로젝트의 모든 참여자를 탈퇴 처리한다.")
    @Test
    void leaveAll_ShouldCallLeaveProjectOnAllAttendants() {
        // given
        ProjectEntity project = mock(ProjectEntity.class);
        AttendantEntity attendant1 = AttendantEntity.builder().build();
        AttendantEntity attendant2 = AttendantEntity.builder().build();
        List<AttendantEntity> attendants = List.of(attendant1, attendant2);
        when(attendantRepository.findAttendantsByProjectIdWithMember(project)).thenReturn(attendants);

        // when
        attendantService.leaveAll(project);

        // then
        assertThat(attendants).extracting("leftAt").doesNotContainNull();
        verify(attendantRepository, times(1)).saveAll(attendants);
    }

    @DisplayName("프로젝트 참여자 업데이트 시, 기존 참여자는 탈퇴 처리되고 신규 참여자가 등록된다.")
    @Test
    void updateAttendants_ShouldUpdateCorrectly() {
        // given
        ProjectEntity project = mock(ProjectEntity.class);
        MemberEntity oldPmMember = MemberEntity.builder().id(1L).name("old pm").email("oldPM@test.co.kr").build();
        MemberEntity creatorMember = MemberEntity.builder().id(1L).name("creator").email("creator@test.co.kr").build();
        MemberEntity newPmMember = MemberEntity.builder().id(2L).name("new pm").email("oldPM@test.co.kr").build();
        MemberEntity workerMember = MemberEntity.builder().id(3L).name("worker pm").email("oldPM@test.co.kr").build();

        AttendantEntity oldPmAttendant = AttendantEntity.builder()
                .member(oldPmMember)
                .role(AttendantRoleType.PM)
                .build();
        AttendantEntity creatorAttendant = AttendantEntity.builder()
                .member(creatorMember)
                .role(AttendantRoleType.CREATOR)
                .build();

        List<AttendantEntity> nowAttendants = List.of(oldPmAttendant, creatorAttendant);
        when(attendantRepository.findAttendantsByProjectIdWithMember(project)).thenReturn(nowAttendants);

        ArgumentCaptor<List<AttendantEntity>> newAttendantsCaptor = ArgumentCaptor.forClass(List.class);

        // when
        attendantService.updateAttendants(project, newPmMember, List.of(workerMember, creatorMember));

        // then
        assertThat(oldPmAttendant.getLeftAt()).isNotNull();

        verify(attendantRepository).saveAll(newAttendantsCaptor.capture());
        List<AttendantEntity> savedNewAttendants = newAttendantsCaptor.getValue();
        assertThat(savedNewAttendants).hasSize(3).as("새로운 PM, 새로운 참여자, CREATOR"); //newPM, worker, creator
        assertThat(savedNewAttendants).extracting(AttendantEntity::getMember)
                .containsExactlyInAnyOrder(newPmMember, workerMember, creatorMember);
        assertThat(savedNewAttendants).extracting(AttendantEntity::getRole)
                .containsExactlyInAnyOrder(AttendantRoleType.PM, AttendantRoleType.WORKER, AttendantRoleType.CREATOR);
    }

    @DisplayName("사용자가 참여중인 프로젝트 목록을 정확히 반환한다.")
    @Test
    void getProjectsByAttendants_ShouldReturnOnlyParticipatingProjects() {
        // given
        long loginUserId = 1L;
        MemberEntity loginUser = mock(MemberEntity.class);
        when(loginUser.getId()).thenReturn(loginUserId);

        ProjectEntity project1 = mock(ProjectEntity.class);
        lenient().when(project1.getId()).thenReturn(20L);
        when(project1.getStartYear()).thenReturn(LocalDate.of(2025, 1, 1));
        ProjectEntity project2 = mock(ProjectEntity.class);
        lenient().when(project2.getId()).thenReturn(57L);
        when(project2.getStartYear()).thenReturn(LocalDate.of(2025, 1, 1));

        AttendantEntity attendant1 = AttendantEntity.builder().project(project1).build();
        AttendantEntity attendant2 = AttendantEntity.builder().project(project2).build();
        List<AttendantEntity> userAttendants = List.of(attendant1, attendant2);

        when(attendantRepository.findAllByMemberId(loginUserId)).thenReturn(Optional.of(userAttendants));
        // getAttendantsNameV2 내부 호출 Mocking
        when(attendantRepository.findAllWithMemberAndProject(anyList())).thenReturn(Optional.of(List.of()));

        // when
        List<ProjectListResponse> result = attendantService.getProjectsByAttendants(loginUser);

        // then
        verify(attendantRepository, times(1)).findAllByMemberId(loginUserId);
        assertThat(result).hasSize(2);
        assertThat(result).extracting("projectId").containsExactlyInAnyOrder(20L, 57L);
    }

}