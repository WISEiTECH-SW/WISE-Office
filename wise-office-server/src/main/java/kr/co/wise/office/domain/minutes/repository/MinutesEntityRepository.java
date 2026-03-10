package kr.co.wise.office.domain.minutes.repository;

import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MinutesEntityRepository extends JpaRepository<MinutesEntity, Long> {

    List<MinutesEntity> findByProjectIdOrderByIdDesc(long projectId);

    int countByMinutesDate(LocalDate minutesDate);

    @Query("select m from MinutesEntity m join fetch m.project where m.id = :minutesId")
    MinutesEntity findByIdWithProject(@Param("minutesId") long minutesId);
}
