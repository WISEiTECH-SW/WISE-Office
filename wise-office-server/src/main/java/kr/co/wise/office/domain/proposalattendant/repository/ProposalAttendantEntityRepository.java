package kr.co.wise.office.domain.proposalattendant.repository;

import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProposalAttendantEntityRepository extends JpaRepository<ProposalAttendantEntity, Long> {


    @Query("select p from ProposalAttendantEntity p join fetch p.companyMember where p.companyMember in :companyMember and p.project.id = :id and " +
            "p.exitDate is null")
    List<ProposalAttendantEntity> findByCompanyMemberInAndId(@Param("companyMember") List<CompanyMemberEntity> companyMember,
                                                             @Param("id") long id);

    @Query("select p from ProposalAttendantEntity p join fetch p.companyMember where p.project.id = :projectId and p.exitDate is null")
    List<ProposalAttendantEntity> findByProjectIdWithCompanyName(@Param("projectId") long projectId);

}
