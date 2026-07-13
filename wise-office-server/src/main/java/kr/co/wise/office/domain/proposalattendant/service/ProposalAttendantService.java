package kr.co.wise.office.domain.proposalattendant.service;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantRole;
import kr.co.wise.office.domain.proposalattendant.repository.ProposalAttendantEntityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class ProposalAttendantService {
    private final ProposalAttendantEntityRepository proposalAttendantEntityRepository;

    public List<String> makeProposalAttendants(List<CompanyMemberEntity> members, ProjectEntity project, Long pmId){
        List<ProposalAttendantEntity> attendantEntities = members.stream()
                .map(a -> ProposalAttendantEntity.builder()
                .companyMember(a)
                .project(project)
                .role(a.getId().equals(pmId) ? ProposalAttendantRole.PM : ProposalAttendantRole.NORMAL)
                .attendDate(LocalDate.now()).build()).toList();
        proposalAttendantEntityRepository.saveAll(attendantEntities);

        return members.stream()
                .map(CompanyMemberEntity::getName)
                .toList();
    }

    public void updateProposalAttendants(ProjectEntity project, List<CompanyMemberEntity> newMembers, Long pmId){
        // 현재 참석자 정보 조회 
        List<ProposalAttendantEntity> nowAttendants =
                proposalAttendantEntityRepository.findProposalAttendantsByProjectIdWithCompanyMember(project);
        Map<Long, ProposalAttendantEntity> nowMap = nowAttendants.stream()
                .collect(Collectors.toMap(
                        a -> a.getCompanyMember().getId(),
                        a -> a
                ));

        // 새롭게 추가될 대상
        Set<Long> newIds = newMembers.stream()
                .map(CompanyMemberEntity::getId)
                .collect(Collectors.toSet());

        // 삭제 대상 검색
        List<ProposalAttendantEntity> deleteTargets = nowAttendants.stream()
                .filter(a -> !newIds.contains(a.getCompanyMember().getId()))
                .toList();

        deleteTargets.forEach(ProposalAttendantEntity::leaveProject);

        // 기존 유지 멤버의 role 변경 처리
        nowAttendants.stream()
                .filter(a -> newIds.contains(a.getCompanyMember().getId()))
                .forEach(a -> {
                    boolean shouldBePm = a.getCompanyMember().getId().equals(pmId);
                    boolean isPm = a.getRole() == ProposalAttendantRole.PM;
                    if (shouldBePm != isPm) {
                        a.changeRole(shouldBePm ? ProposalAttendantRole.PM : ProposalAttendantRole.NORMAL);
                    }
                });

        // 추가 대상 (리스트로 수집)
        List<ProposalAttendantEntity> newAttendants = newMembers.stream()
                .filter(m -> !nowMap.containsKey(m.getId()))
                .map(m -> ProposalAttendantEntity.builder()
                        .companyMember(m)
                        .project(project)
                        .role(m.getId().equals(pmId) ? ProposalAttendantRole.PM : ProposalAttendantRole.NORMAL)
                        .attendDate(LocalDate.now())
                        .build())
                .toList();

        // 배치 저장
        proposalAttendantEntityRepository.saveAll(newAttendants);
    }
}
