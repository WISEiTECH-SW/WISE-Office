package kr.co.wise.office.domain.comment.repository;

import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.comment.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    void deleteByLog(LogEntity log);

}
