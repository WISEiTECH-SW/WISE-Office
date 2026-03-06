package kr.co.wise.office.domain.proposalattendant.repository;

import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProposalAttendantEntityRepository extends JpaRepository<ProposalAttendantEntity, Long> {
    List<ProposalAttendantEntity> findAllByProject_Id(Long projectId);
}
