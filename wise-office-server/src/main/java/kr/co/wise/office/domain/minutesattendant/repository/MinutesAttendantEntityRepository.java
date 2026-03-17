package kr.co.wise.office.domain.minutesattendant.repository;

import kr.co.wise.office.domain.minutesattendant.entity.MinutesAttendantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface MinutesAttendantEntityRepository extends JpaRepository<MinutesAttendantEntity, Long> {


    @Query("select distinct cm.id from MinutesAttendantEntity m " +
            "join m.minutesEntity mm " +
            "join m.proposalAttendantEntity p " +
            "join m.proposalAttendantEntity.companyMember cm " +
            "where m.minutesEntity.minutesDate = :minutesDate")
    Set<Long> findOverlappingMembers(
            @Param("minutesDate")LocalDate minutesDate
    );

    @Query("select c.name from MinutesAttendantEntity m join m.proposalAttendantEntity p join p.companyMember c where m.minutesEntity.id = :minutesId")
    List<String> findMemberNamesByMinutesId(@Param("minutesId") long minutesId);

    @Query("""
            select m.minutesEntity.id as minutesId, c.name as companyName
            from MinutesAttendantEntity m
            join m.proposalAttendantEntity p
            join p.companyMember c
            where m.minutesEntity.id in :minutesIds
            order by m.minutesEntity.id asc, m.id asc
            """)
    List<MinutesAttendantNameProjection> findAttendantNamesByMinutesIds(@Param("minutesIds") Collection<Long> minutesIds);

    interface MinutesAttendantNameProjection {
        Long getMinutesId();

        String getCompanyName();
    }

    @Query("select m from MinutesAttendantEntity m join fetch m.proposalAttendantEntity p join fetch p.companyMember c where m.minutesEntity.id = :minutesId")
    List<MinutesAttendantEntity> findAttendantsByMinutesId(@Param("minutesId") long minutesId);
}
