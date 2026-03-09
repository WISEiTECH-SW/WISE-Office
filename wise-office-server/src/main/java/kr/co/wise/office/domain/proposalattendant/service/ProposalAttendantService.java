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

//        List<String> proposalAttendantsName = new ArrayList<>();
//        for(ProposalAttendantEntity proposalAttendant : attendantEntities){
//            proposalAttendantsName.add(proposalAttendant.getCompanyMember().getName());
//        }
//        return proposalAttendantsName;
        return members.stream()
                .map(CompanyMemberEntity::getName)
                .toList();
    }

    public void updateProposalAttendants(ProjectEntity project, List<CompanyMemberEntity> newMembers){
        List<ProposalAttendantEntity> nowAttendants = proposalAttendantEntityRepository.findProposalAttendantsByProjectIdWithCompanyMember(project);

        // 편성인원 삭제 처리
        nowAttendants.forEach(ProposalAttendantEntity::leaveProject);
        // 새 인원 등록
        List<ProposalAttendantEntity> attendantEntities = newMembers.stream()
                .map(a -> ProposalAttendantEntity.builder()
                        .companyMember(a)
                        .project(project)
                        .attendDate(LocalDate.now()).build()).toList();
        proposalAttendantEntityRepository.saveAll(attendantEntities);
    }
}
