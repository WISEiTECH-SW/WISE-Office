package kr.co.wise.office.domain.proposalattendant.service;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.repository.ProposalAttendantEntityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class ProposalAttendantService {
    private final ProposalAttendantEntityRepository proposalAttendantEntityRepository;

    public List<String> makeProposalAttendants(List<CompanyMemberEntity> attendants, ProjectEntity project){
        List<ProposalAttendantEntity> attendantEntities = attendants.stream()
                .map(a -> ProposalAttendantEntity.builder()
                .companyMember(a)
                .project(project)
                .attendDate(LocalDateTime.now()).build()).toList();
        proposalAttendantEntityRepository.saveAll(attendantEntities);

        List<String> proposalAttendantsName = new ArrayList<>();
        for(ProposalAttendantEntity proposalAttendant : attendantEntities){
            proposalAttendantsName.add(proposalAttendant.getCompanyMember().getName());
        }
        return proposalAttendantsName;
    }
}
