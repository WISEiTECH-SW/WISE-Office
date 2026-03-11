package kr.co.wise.office.domain.Project.repository;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

    @Query("select p from ProjectEntity p join fetch p.member where p.closed = false order by p.id desc")
    Optional<List<ProjectEntity>> findAllProjectWithManager();

    @Query("select p from ProjectEntity p join fetch p.member where p.closed = false and p.id = :projectId")
    Optional<ProjectEntity> findProjectWithManager(@Param("projectId") long projectId);

    // Project : Member => N : 1 관계기 때문에 join fetch 써도 무관
    @Query(value = "select p from ProjectEntity p join fetch p.member where p.closed = false",
           countQuery = "select count(p) from ProjectEntity p where p.closed = false")
    Page<ProjectEntity> findProjectsWithPaging(Pageable pageable);

    @Query("SELECT p FROM ProjectEntity p JOIN FETCH p.member WHERE p.closed = false ORDER BY YEAR(p.startYear) ASC, p.id ASC")
    List<ProjectEntity> findAllOrderByYearAndPk();
}
