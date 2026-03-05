package kr.co.wise.office.domain.minutesattendant.repository;

import kr.co.wise.office.domain.minutesattendant.entity.MinutesAttendantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MinutesAttendantEntityRepository extends JpaRepository<MinutesAttendantEntity, Long> {

}
