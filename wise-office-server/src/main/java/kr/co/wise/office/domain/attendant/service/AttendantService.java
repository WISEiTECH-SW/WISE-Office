package kr.co.wise.office.domain.attendant.service;

import kr.co.wise.office.domain.Project.dto.ProjectDetailResponse;
import kr.co.wise.office.domain.Project.dto.ProjectListResponse;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantRoleType;
import kr.co.wise.office.domain.attendant.repository.AttendantRepository;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class AttendantService {

    private static final String NOT_FOUND_ATTENDANT = "존재하지 않는 참여자입니다.";

    private final AttendantRepository attendantRepository;

    public void makeAttendants(List<MemberEntity> attendants, ProjectEntity project) {
        List<AttendantEntity> entities = attendants.stream().map(attendant -> {
            AttendantEntity entity = AttendantEntity.builder()
                    .member(attendant)
                    .project(project)
                    .build();
            return entity;
        }).toList();

        attendantRepository.saveAll(entities);
    }

    public void makeAttendantsV2(MemberEntity creator, MemberEntity manager, List<MemberEntity> workers, ProjectEntity project) {
        // CREATOR 저장
        AttendantEntity creatorEntity = AttendantEntity.builder()
                .member(creator)
                .project(project)
                .role(AttendantRoleType.CREATOR)
                .build();
        attendantRepository.save(creatorEntity);

        // MANAGER 저장
        AttendantEntity managerEntity = AttendantEntity.builder()
                .member(manager)
                .project(project)
                .role(AttendantRoleType.PM)
                .build();
        attendantRepository.save(managerEntity);

        // WORKERS 저장 => MANAGER / CREATOR는 제외
        List<AttendantEntity> workerEntities = workers.stream().filter(worker -> {
            if (worker.getId().equals(creator.getId()) || worker.getId().equals(manager.getId())) {
                return false;
            }
            return true;
        }).map(worker -> AttendantEntity.builder()
                .member(worker)
                .project(project)
                .role(AttendantRoleType.WORKER)
                .build()).toList();
        attendantRepository.saveAll(workerEntities);
    }


    public Map<Long, List<String>> getAttendantsName(List<Long> projectIds) {
        List<AttendantEntity> allWithMemberAndProject = attendantRepository.findAllWithMemberAndProject(projectIds)
                .orElse(Collections.emptyList());

        return allWithMemberAndProject.stream()
                .collect(Collectors.groupingBy(
                        // KEY 값 설정
                        attendant -> attendant.getProject().getId(),
                        // Value 설정 => List<String>
                        Collectors.mapping(
                                attendant -> attendant.getMember().getName(),
                                Collectors.toList()
                        )
                ));
    }

    public void getAttendantsNameV2(List<ProjectListResponse> response) {
        List<Long> projectIds = response.stream().map(ProjectListResponse::getProjectId).toList();
        List<AttendantEntity> allWithMemberAndProject = attendantRepository.findAllWithMemberAndProject(projectIds)
                .orElse(Collections.emptyList());

        // <프로젝트 ID, 참여자 name List 반환>
        Map<Long, List<String>> attendantsName = allWithMemberAndProject.stream()
                .filter(attendant -> !attendant.getRole().equals(AttendantRoleType.PM))
                .collect(Collectors.groupingBy(
                        // KEY 값 설정
                        attendant -> attendant.getProject().getId(),
                        // Value 설정 => List<String>
                        Collectors.mapping(
                                attendant -> attendant.getMember().getName(),
                                Collectors.toList()
                        )
                ));

        response.forEach(
                project ->
                        project.setAttendant(attendantsName.getOrDefault(project.getProjectId(), Collections.emptyList())));

        // Manager 이름 설정
        response.forEach(r -> {
            for (AttendantEntity attendant : allWithMemberAndProject) {
                if (r.getProjectId() == attendant.getProject().getId() && attendant.getRole() == AttendantRoleType.PM) {
                    r.setManagerName(attendant.getMember().getName());
                }
            }
        });
    }

    public void getDetailAttendants(ProjectDetailResponse response, MemberEntity loginUser) {
        List<AttendantEntity> attendants = attendantRepository
                .findAllWithMemberAndProject(List.of(response.getProjectId())).orElseThrow(IllegalArgumentException::new);

        //참여자 설정
        response.setAttendant(attendants.stream().map(attendant ->
                attendant.getMember().getName()).collect(Collectors.toSet()).stream().toList());

        for (AttendantEntity attendant : attendants) {
            //해당 로그인한 유저의 Role이 PM / CREATOR인지 확인
            if (attendant.getMember().getId().equals(loginUser.getId())) {
                if (attendant.getRole().equals(AttendantRoleType.CREATOR)) {
                    response.setCanModify(true);
                } else if(attendant.getRole().equals(AttendantRoleType.PM)) {
                    response.setCanModify(true);
                }
            }

            // 매니저인 경우 Manager 이름까지 설정
            if (attendant.getRole().equals(AttendantRoleType.PM)) {
                response.setManagerName(attendant.getMember().getName());
            }
        }
    }

    public List<ProjectListResponse> getProjectsByAttendants(MemberEntity loginUser) {
        List<AttendantEntity> attendants = attendantRepository.findAllByMemberId(loginUser.getId())
                .orElse(Collections.emptyList());

        List<ProjectEntity> projects = attendants.stream().map(AttendantEntity::getProject).toList();
        List<ProjectListResponse> response = projects.stream().map(ProjectListResponse::loadProjectInfo).toList();

        getAttendantsNameV2(response);
        return response;
    }

    public AttendantEntity validateParticipatingProject(MemberEntity loginUser, ProjectEntity project) {
        return attendantRepository.findByMemberAndProject(loginUser, project).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_ATTENDANT));
    }
}
