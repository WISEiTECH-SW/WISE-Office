package kr.co.wise.office.domain.proposalattendant.repository;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProposalAttendantEntityRepository extends JpaRepository<ProposalAttendantEntity, Long> {
    List<ProposalAttendantEntity> findAllByProject_Id(Long projectId);

    @Query("select a from ProposalAttendantEntity a join fetch a.companyMember where a.exitDate is null and a.project = :project")
    List<ProposalAttendantEntity> findProposalAttendantsByProjectIdWithCompanyMember(@Param("project")ProjectEntity project);
}
