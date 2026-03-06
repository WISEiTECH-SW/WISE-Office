package kr.co.wise.office.domain.proposalattendant.repository;

import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalAttendantEntityRepository extends JpaRepository<ProposalAttendantEntity, Long> {


    List<ProposalAttendantEntity> findByCompanyMemberInAndProjectId(List<CompanyMemberEntity> companyMember, long projectId);
}
