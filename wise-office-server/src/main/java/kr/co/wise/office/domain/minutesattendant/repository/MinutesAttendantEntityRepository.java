package kr.co.wise.office.domain.minutesattendant.repository;

import kr.co.wise.office.domain.minutesattendant.entity.MinutesAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MinutesAttendantEntityRepository extends JpaRepository<MinutesAttendantEntity, Long> {


    @Query("select m from MinutesAttendantEntity m join fetch m.minutesEntity mm where m.proposalAttendantEntity in :entity and m.minutesEntity.minutesDate = :minutesDate")
    List<MinutesAttendantEntity> findByProposalAndMinutesDate(
            @Param("entity") List<ProposalAttendantEntity> proposalAttendants,
            @Param("minutesDate")LocalDate minutesDate
    );

}
