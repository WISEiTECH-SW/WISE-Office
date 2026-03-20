package kr.co.wise.office.domain.minutes.repository;

import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MinutesEntityRepository extends JpaRepository<MinutesEntity, Long> {

    List<MinutesEntity> findByProjectIdOrderByIdDesc(long projectId);

    @Query("select count(m) from MinutesEntity m where m.minutesDate = :minutesDate and m.project.id = :projectId")
    int countByMinutesDate(@Param("minutesDate") LocalDate minutesDate,
                           @Param("projectId") long projectId);

    @Query("select m from MinutesEntity m join fetch m.project p where m.id = :minutesId and p.id = :projectId")
    Optional<MinutesEntity> findByIdWithProject(@Param("minutesId") long minutesId, @Param("projectId") long projectId);


    @Query("""
            select m
            from MinutesEntity m
            join fetch m.project p
            where m.minutesDate between :start and :end
            order by m.minutesDate desc, m.startTime desc, m.id desc
            """)
    List<MinutesEntity> findMonthlyOverviewTargets(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
