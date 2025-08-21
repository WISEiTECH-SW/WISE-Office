package kr.co.wise.office.domain.comment.repository;

import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.comment.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    void deleteByLog(LogEntity log);

    @Query("select c from CommentEntity c join fetch c.member where c.log.id = :logId order by c.id desc")
    List<CommentEntity> findAllByLogIdWithMemberOrderByWrittenAtAsc(@Param("logId") Long logId);

    @Query("select c from CommentEntity c join fetch c.member where c.id = :commentId")
    Optional<CommentEntity> findByIdWithMember(@Param("commentId") long commentId);
}
