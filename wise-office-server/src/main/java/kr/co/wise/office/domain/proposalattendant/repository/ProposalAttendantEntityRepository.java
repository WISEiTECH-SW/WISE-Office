package kr.co.wise.office.domain.proposalattendant.repository;

import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProposalAttendantEntityRepository extends JpaRepository<ProposalAttendantEntity, Long> {
    List<ProposalAttendantEntity> findAllByProject_Id(Long projectId);


    @Query("select p from ProposalAttendantEntity p join fetch p.companyMember where p.companyMember in :companyMember and p.project.id = :id and " +
            "p.exitDate is null")
    List<ProposalAttendantEntity> findByCompanyMemberInAndId(@Param("companyMember") List<CompanyMemberEntity> companyMember,
                                                             @Param("id") long id);

    @Query("select p from ProposalAttendantEntity p join fetch p.companyMember where p.project.id = :projectId and p.exitDate is null")
    List<ProposalAttendantEntity> findByProjectIdWithCompanyName(@Param("projectId") long projectId);

}
