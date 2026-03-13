package kr.co.wise.office.domain.approve.repository;

import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApproveEntityRepository extends JpaRepository<ApproveEntity, Long> {


    @Query("select a from ApproveEntity a join fetch a.minutesEntity m where m.project.id = :projectId order by a.id desc")
    List<ApproveEntity> findByProjectId(@Param("projectId") long projectId);

    @Query("select a from ApproveEntity a join fetch a.minutesEntity where a.id = :approveId")
    Optional<ApproveEntity> findByApproveIdWithMinutes(@Param("approveId") long approveId);

    @Query("select a from ApproveEntity a join fetch a.minutesEntity m where a.id = :approveId and m.project.id = :projectId")
    Optional<ApproveEntity> findByApproveIdAndProjectId(@Param("approveId") long approveId, @Param("projectId") long projectId);

    @Query("select a from ApproveEntity a join a.minutesEntity m join m.project p where m.id = :minutesId and p.id = :projectId")
    Optional<ApproveEntity> findByMinutesIdAndProjectId(@Param("minutesId") long minutesId, @Param("projectId") long projectId);
}
