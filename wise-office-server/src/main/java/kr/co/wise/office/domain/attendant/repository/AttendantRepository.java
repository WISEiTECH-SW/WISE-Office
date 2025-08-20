package kr.co.wise.office.domain.attendant.repository;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendantRepository extends JpaRepository<AttendantEntity, Long> {

    @Query("select a from AttendantEntity a join fetch a.member join fetch a.project where a.project.id in :ids")
    Optional<List<AttendantEntity>> findAllWithMemberAndProject(@Param("ids") List<Long> ids);

    Optional<List<AttendantEntity>> findAllByMemberId(Long id);

    Optional<AttendantEntity> findByMemberAndProject(MemberEntity loginUser, ProjectEntity project);
}
