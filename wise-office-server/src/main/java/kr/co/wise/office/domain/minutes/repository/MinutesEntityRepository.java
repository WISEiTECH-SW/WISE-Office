package kr.co.wise.office.domain.minutes.repository;

import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MinutesEntityRepository extends JpaRepository<MinutesEntity, Long> {

    List<MinutesEntity> findByProjectId(long projectId);

    int countByMinutesDate(LocalDate minutesDate);

}
