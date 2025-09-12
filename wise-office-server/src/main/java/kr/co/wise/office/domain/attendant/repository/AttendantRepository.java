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

    @Query("select a from AttendantEntity a join fetch a.member join fetch a.project where a.leftAt is null and a.project.id in :ids")
    Optional<List<AttendantEntity>> findAllWithMemberAndProject(@Param("ids") List<Long> ids);

    @Query("select a from AttendantEntity a join fetch a.project where a.leftAt is null and a.member.id = :id")
    Optional<List<AttendantEntity>> findAllByMemberId(@Param("id") Long id);

    @Query("select a from AttendantEntity a where a.leftAt is null and a.member = :member and a.project = :project")
    List<AttendantEntity> findByMemberAndProject(@Param("member") MemberEntity loginUser, @Param("project")ProjectEntity project);

    @Query("select a from AttendantEntity a join fetch a.member where a.leftAt is null and a.project = :project")
    List<AttendantEntity> findAttendantsByProjectIdWithMember(@Param("project") ProjectEntity project);
}
