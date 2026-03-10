package kr.co.wise.office.domain.proposalattendant.service;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.repository.ProposalAttendantEntityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class ProposalAttendantService {
    private final ProposalAttendantEntityRepository proposalAttendantEntityRepository;

    public List<String> makeProposalAttendants(List<CompanyMemberEntity> members, ProjectEntity project){
        List<ProposalAttendantEntity> attendantEntities = members.stream()
                .map(a -> ProposalAttendantEntity.builder()
                .companyMember(a)
                .project(project)
                .attendDate(LocalDate.now()).build()).toList();
        proposalAttendantEntityRepository.saveAll(attendantEntities);

        return members.stream()
                .map(CompanyMemberEntity::getName)
                .toList();
    }

    public void updateProposalAttendants(ProjectEntity project, List<CompanyMemberEntity> newMembers){

        List<ProposalAttendantEntity> nowAttendants =
                proposalAttendantEntityRepository.findProposalAttendantsByProjectIdWithCompanyMember(project);

        Map<Long, ProposalAttendantEntity> nowMap = nowAttendants.stream()
                .collect(Collectors.toMap(
                        a -> a.getCompanyMember().getId(),
                        a -> a
                ));

        Set<Long> newIds = newMembers.stream()
                .map(CompanyMemberEntity::getId)
                .collect(Collectors.toSet());

        // 삭제 대상
        nowAttendants.stream()
                .filter(a -> !newIds.contains(a.getCompanyMember().getId()))
                .forEach(ProposalAttendantEntity::leaveProject);

        // 추가 대상 (리스트로 수집)
        List<ProposalAttendantEntity> newAttendants = newMembers.stream()
                .filter(m -> !nowMap.containsKey(m.getId()))
                .map(m -> ProposalAttendantEntity.builder()
                        .companyMember(m)
                        .project(project)
                        .attendDate(LocalDate.now())
                        .build())
                .toList();

        // 배치 저장
        proposalAttendantEntityRepository.saveAll(newAttendants);
    }
}
