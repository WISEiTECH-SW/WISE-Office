package kr.co.wise.office.domain.minutes.repository;

import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MinutesEntityRepository extends JpaRepository<MinutesEntity, Long> {

}
