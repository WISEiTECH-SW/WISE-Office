package kr.co.wise.office.domain.Log.repository;

import kr.co.wise.office.api.dto.log.LogWithCountDto;
import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query(
            value = """
        select new kr.co.wise.office.api.dto.log.LogWithCountDto(
            l,
            count(c)
        )
        from LogEntity l
        left join l.comments c on c.deleted = false
        where l.deleted = false
          and l.project = :project
        group by l
    """,
            countQuery = """
        select count(l)
        from LogEntity l
        where l.deleted = false
          and l.project = :project
    """
    )
    Page<LogWithCountDto> findLogsWithCommentCount(
            @Param("project") ProjectEntity project,
            Pageable pageable
    );
}
