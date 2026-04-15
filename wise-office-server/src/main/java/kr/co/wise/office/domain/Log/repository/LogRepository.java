package kr.co.wise.office.domain.Log.repository;

import kr.co.wise.office.api.dto.log.LogWithCountDto;
import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LogRepository extends JpaRepository<LogEntity, Long> {

    @Query("select l from LogEntity l join fetch l.member left join fetch l.comments where l.deleted = false and l.project = :project order by l.id desc")
    Optional<List<LogEntity>> findByLogWithComments(@Param("project") ProjectEntity project);

    @Query("select l from LogEntity l join fetch l.member where l.deleted = false and l.id = :logId")
    Optional<LogEntity> findByIdWithMember(@Param("logId") long logId);

    @Modifying
    @Query("update LogEntity l set l.deleted = true where l.id = :logId")
    void deleteLog(@Param("logId") long logId);

    @EntityGraph(attributePaths = "member")
    @Query("""
        select l
        from LogEntity l
        where l.deleted = false
          and l.project = :project
    """)
    Page<LogEntity> findLogs(ProjectEntity project, Pageable pageable);

    @Query("""
        select c.log.id, count(c)
        from CommentEntity c
        where c.deleted = false
          and c.log in :logs
        group by c.log.id
    """)
    List<Object[]> countComments(List<LogEntity> logs);
}
