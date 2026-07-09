package kr.co.wise.office.domain.proposalattendant.repository;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProposalAttendantEntityRepository extends JpaRepository<ProposalAttendantEntity, Long> {
    List<ProposalAttendantEntity> findAllByProject_Id(Long projectId);

    @Query("select a from ProposalAttendantEntity a join fetch a.companyMember where a.exitDate is null and a.project = :project")
    List<ProposalAttendantEntity> findProposalAttendantsByProjectIdWithCompanyMember(@Param("project")ProjectEntity project);


    @Query("select p from ProposalAttendantEntity p join fetch p.companyMember where p.id in :proposalIds and p.project.id = :projectId and " +
            "p.exitDate is null")
    List<ProposalAttendantEntity> findByProposalAttendantIdInAndProjectId(@Param("proposalIds") Collection<Long> proposalIds,
                                                                          @Param("projectId") long projectId);

    @Query("select p from ProposalAttendantEntity p join fetch p.companyMember where p.project.id = :projectId and p.exitDate is null")
    List<ProposalAttendantEntity> findByProjectIdWithCompanyName(@Param("projectId") long projectId);

    @Query("select p from ProposalAttendantEntity p join fetch p.companyMember where p.id = :id and p.project.id = :projectId")
    Optional<ProposalAttendantEntity> findWriterInfo(@Param("id") long writerProposalAttendantId,
                                                     @Param("projectId") long projectId);

    @Query("select p from ProposalAttendantEntity p join fetch p.companyMember where p.id in :proposalIds and p.project.id = :projectId")
    List<ProposalAttendantEntity> findWriterInfos(@Param("proposalIds") List<Long> proposalIds,
                                                  @Param("projectId") long projectId);

    List<ProposalAttendantEntity> findByCompanyMemberIn(List<CompanyMemberEntity> companyMember);

}
