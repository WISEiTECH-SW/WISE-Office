package kr.co.wise.office.domain.attendant.service;

import kr.co.wise.office.domain.Project.dto.ProjectDetailResponse;
import kr.co.wise.office.domain.Project.dto.ProjectListResponse;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.dto.AttendantDetail;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantRoleType;
import kr.co.wise.office.domain.attendant.repository.AttendantRepository;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.member.dto.MemberListResponse;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.repository.ProposalAttendantEntityRepository;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class AttendantService {

    private final AttendantRepository attendantRepository;
    private final ProposalAttendantEntityRepository proposalAttendantEntityRepository;

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

    public List<String> makeAttendantsV2(MemberEntity creator, MemberEntity manager, List<MemberEntity> workers, ProjectEntity project) {
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

        //생성된 참여자 이름 목록 반환
        List<String> attendantsName = new ArrayList<>();
        for (AttendantEntity attendant : workerEntities) {
            attendantsName.add(attendant.getMember().getName());
        }
        //PM 이랑 CREATOR가 다른 경우 ==> CREATOR 참여자 이름 목록에 추가
        if (!manager.getId().equals(creator.getId())) {
            attendantsName.add(creator.getName());
        }

        return attendantsName;
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

        // PM이 동시에 CREATOR인 경우 CREATOR 객체 참여자 list에 제외
        Map<String, AttendantEntity> m = allWithMemberAndProject.stream()
                .collect(Collectors.toMap( a -> a.getProject().getId() + "-" + a.getMember().getId(), Function.identity(),
                        (existing, replacement) -> {
                            //기존이 PM이면 그대로, CREATOR면 대체
                            if (existing.getRole() == AttendantRoleType.PM) return existing;
                            return replacement;
                        }));
        List<AttendantEntity> removeDuplicatedList = m.values().stream().toList();

        // <프로젝트 ID, 참여자 name List 반환>
        Map<Long, List<String>> attendantsName = removeDuplicatedList.stream()
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
            for (AttendantEntity attendant : removeDuplicatedList) {
                if (r.getProjectId() == attendant.getProject().getId() && attendant.getRole() == AttendantRoleType.PM) {
                    String managerName = attendant.getMember().getName();
                    r.setManagerName(managerName);
                }
            }
        });
    }

    public void getDetailAttendants(ProjectDetailResponse response, MemberEntity loginUser) {
//        편성인원 추가
        List<ProposalAttendantEntity> proposalAttendants =
                proposalAttendantEntityRepository.findAllByProject_Id(response.getProjectId());

        response.setProposalAttendant(
                proposalAttendants.stream()
                        .map(ProposalAttendantEntity::getCompanyMember)
                        .map(MemberListResponse::convertCompanyMembertoMember)
                        .toList()
        );

//        기존 회원 추가
        List<AttendantEntity> attendants = attendantRepository
                .findAllWithMemberAndProject(List.of(response.getProjectId())).orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_ATTENDANT));

        AttendantEntity manager = attendants.stream().filter(att -> att.getRole() == AttendantRoleType.PM).findFirst().get();

        //현재 로그인한 유저가 프로젝트에 참여중인지 확인
        boolean isAttending = attendants.stream().anyMatch(att -> att.getMember().getId().equals(loginUser.getId()));
        response.setAttending(isAttending);

        //참여자 설정 => 중복 제거를 위해 Set으로 변환 후 List 변환
        response.setAttendant(attendants.stream()
                        .filter(att ->{
                                    if (att.getRole() == AttendantRoleType.CREATOR && att.getMember().getId().equals(manager.getMember().getId())) {
                                        return false;
                                    }
                                    return true;})
                        .filter(att -> !(att.getRole() == AttendantRoleType.PM))
                .map(AttendantEntity::getMember).map(AttendantDetail::of)
                .collect(Collectors.toSet()).stream().toList());

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
                MemberEntity pm = attendant.getMember();
                response.setManagerName(AttendantDetail.of(pm));
            }
        }
    }

    public List<ProjectListResponse> getProjectsByAttendants(MemberEntity loginUser) {
        List<AttendantEntity> attendants = attendantRepository.findAllByMemberId(loginUser.getId())
                .orElse(Collections.emptyList());

        List<AttendantEntity> filteredDuplicated = attendants.stream()
                .collect(Collectors.toMap(
                        a -> a.getProject().getId(),
                        Function.identity(),
                        (existing, replacement) -> {
                            if (existing.getRole() == AttendantRoleType.PM) return existing;
                            if (replacement.getRole() == AttendantRoleType.PM) return replacement;
                            return existing;
                        }
                )).values().stream().toList();

        List<ProjectEntity> projects = filteredDuplicated.stream().map(AttendantEntity::getProject).toList();
        List<ProjectListResponse> response = projects.stream().map(ProjectListResponse::loadProjectInfo).toList();

        getAttendantsNameV2(response);
        return response;
    }

    public AttendantEntity validateParticipatingProjectForViewing(MemberEntity loginUser, ProjectEntity project) {
        // PM/CREATOR 둘 다 있는 경우 방지
        List<AttendantEntity> attendants = attendantRepository.findByMemberAndProject(loginUser, project);
        // 프로젝트에 참여하지 않은 경우
        if (attendants.isEmpty()) {
            return AttendantEntity.builder()
                    .role(AttendantRoleType.WORKER)
                    .build();
        }
        if (attendants.size() == 1) {
            return attendants.get(0);
        }

        // PM / CREATOR 둘 다 가지고 있는 경우 PM 권한이 있는 걸로 반환
        AttendantEntity first = attendants.get(0);
        return first.getRole() == AttendantRoleType.PM ? first : attendants.get(1);
    }

    public AttendantEntity validateParticipatingProject(MemberEntity loginUser, ProjectEntity project) {
        // PM/CREATOR 둘 다 있는 경우 방지
        List<AttendantEntity> attendants = attendantRepository.findByMemberAndProject(loginUser, project);
        // 프로젝트에 참여하지 않은 경우
        if (attendants.isEmpty()) {
            throw new NotFoundResourceException(ErrorMessage.NOT_FOUND_ATTENDANT);
        }
        if (attendants.size() == 1) {
            return attendants.get(0);
        }

        // PM / CREATOR 둘 다 가지고 있는 경우 PM 권한이 있는 걸로 반환
        AttendantEntity first = attendants.get(0);
        return first.getRole() == AttendantRoleType.PM ? first : attendants.get(1);
    }

    public void updateAttendants(ProjectEntity project, MemberEntity newPM, List<MemberEntity> newMembers) {
        List<AttendantEntity> nowAttendants = attendantRepository.findAttendantsByProjectIdWithMember(project);
        Optional<AttendantEntity> creator = nowAttendants.stream().filter(att -> att.getRole() == AttendantRoleType.CREATOR)
                .findFirst();
        Long creatorId = creator.map(att -> att.getMember().getId()).orElse(null);

        //모두 탈퇴 처리
        nowAttendants.forEach(AttendantEntity::leaveProject);

        List<AttendantEntity> newAttendants = new ArrayList<>();
        // 1. CREATOR가 프로젝트에 남아 있는지 확인
        if (creator.isPresent()) {
            MemberEntity creatorMember = creator.get().getMember();
            boolean creatorRemain = newMembers.stream().anyMatch(m -> m.getId().equals(creatorMember.getId()));
            if(creatorRemain){
                newAttendants.add(AttendantEntity.builder()
                        .member(creatorMember)
                        .project(project)
                        .role(AttendantRoleType.CREATOR)
                        .build());
            }
        }
        // 2. PM 추가
        newAttendants.add(AttendantEntity.builder()
                .member(newPM)
                .project(project)
                .role(AttendantRoleType.PM)
                .build());
        // 3. Worker 등록
        newMembers.stream()
                .filter(m -> creatorId == null || !m.getId().equals(creatorId))
                .filter(m -> !m.getId().equals(newPM.getId()))
                .forEach(m -> newAttendants.add(
                        AttendantEntity.builder()
                                .member(m)
                                .project(project)
                                .role(AttendantRoleType.WORKER)
                                .build()));

        attendantRepository.saveAll(newAttendants);
    }

    /**
     * 모두 삭제하는 것이 아닌, 비교 후 업데이트만 하는 코드 => PM/CREATOR 구분이 필요함
     */
//    public void updateAttendants(ProjectEntity project, MemberEntity newPM, List<MemberEntity> newAttendants) {
//        List<AttendantEntity> nowAttendants = attendantRepository.findAttendantsByProjectIdWithMember(project); //현재 참여자
//
//        // 현재 참여자 목록 => Key : 참여자 멤버 PK 값
//        Map<Long, AttendantEntity> nowAttendantsMap = nowAttendants.stream().collect(Collectors.toMap(
//                att -> att.getMember().getId(), Function.identity(),
//                (existing, duplicated) -> {
//                    if (duplicated.getRole() == AttendantRoleType.PM) {
//                        existing.changeRole(AttendantRoleType.PM);
//                    }
//                    return existing;
//                }));
//
//        //최종적으로 프로젝트에 있어야 할 모든 멤버의 Id Set
//        Set<Long> resultMemberIds = newAttendants.stream().map(MemberEntity::getId).collect(Collectors.toSet());
//        Map<Long, MemberEntity> newAttendantsMap = newAttendants.stream().collect(Collectors.toMap(MemberEntity::getId, Function.identity()));
//        resultMemberIds.add(newPM.getId());
//
//        // 변경될/추가될 Attendant 목록을 관리할 리스트
//        List<AttendantEntity> attendantsToSave = new ArrayList<>();
//
//        //현재 참여 중인 참여자 처리
//        nowAttendantsMap.forEach((memberId, attendant) -> {
//            // 프로젝트에서 제외되는 경우
//            if (!resultMemberIds.contains(memberId)) {
//                attendant.leaveProject();
//                attendantsToSave.add(attendant);
//            } else { // 기존 참여자가 PM이 되거나, PM이 WORKER가 되는 경우 확인
//                if(memberId.equals(newPM.getId())){
//                    attendant.changeRole(AttendantRoleType.PM);
//                    attendantsToSave.add(attendant);
//                } else if (!memberId.equals(newPM.getId()) && attendant.getRole() == AttendantRoleType.PM) { // PM에서 WORKER가 되는 경우
//                    attendant.changeRole(AttendantRoleType.WORKER);
//                    attendantsToSave.add(attendant);
//                }
//            }
//        });
//
//        // 신규 참여자 처리
//        resultMemberIds.forEach(memberId -> {
//            // 기존 참여자가 아닌 경우 => 신규 참여
//            if (!nowAttendantsMap.containsKey(memberId)) {
//                MemberEntity member = (memberId.equals(newPM.getId())) ? newPM : newAttendantsMap.get(memberId);
//                // 역할
//                AttendantRoleType role = memberId.equals(newPM.getId()) ? AttendantRoleType.PM : AttendantRoleType.WORKER;
//                AttendantEntity newAttendant = AttendantEntity.builder()
//                        .member(member)
//                        .project(project)
//                        .role(role)
//                        .build();
//                attendantsToSave.add(newAttendant);
//            }
//        });
//
//        if (!attendantsToSave.isEmpty()) {
//            attendantRepository.saveAll(attendantsToSave);
//        }
//    }
    public void leaveAll(ProjectEntity project) {
        List<AttendantEntity> attendantsByProjectIdWithMember = attendantRepository.findAttendantsByProjectIdWithMember(project);
        attendantsByProjectIdWithMember.forEach(AttendantEntity::leaveProject);
        attendantRepository.saveAll(attendantsByProjectIdWithMember);
    }
}
