package kr.co.wise.office.domain.Project.repository;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

    @Query("select p from ProjectEntity p join fetch p.member")
    Optional<List<ProjectEntity>> findAllProjectWithManager();

    @Query("select p from ProjectEntity p join fetch p.member where p.id = :projectId")
    Optional<ProjectEntity> findProjectWithManager(@Param("projectId") long projectId);

}
