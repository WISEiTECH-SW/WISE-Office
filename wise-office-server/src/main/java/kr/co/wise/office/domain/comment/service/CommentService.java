package kr.co.wise.office.domain.comment.service;

import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.comment.repository.CommentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    @Transactional
    public void removeCommentByLog(LogEntity log) {
        commentRepository.deleteByLog(log);
    }

}
