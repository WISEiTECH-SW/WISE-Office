package kr.co.wise.office.domain.Log.repository;

import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LogRepository extends JpaRepository<LogEntity, Long> {

    @Query("select l from LogEntity l join fetch l.member left join fetch l.comments where l.project = :project order by l.id desc")
    Optional<List<LogEntity>> findByLogWithComments(@Param("project") ProjectEntity project);

    @Query("select l from LogEntity l join fetch l.member where l.id = :logId")
    Optional<LogEntity> findByIdWithMember(@Param("logId") long logId);
}
