package kr.co.wise.office.domain.comment.service;

import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.comment.dto.CommentCreateRequest;
import kr.co.wise.office.domain.comment.dto.CommentUpdateRequest;
import kr.co.wise.office.domain.comment.entity.CommentEntity;
import kr.co.wise.office.domain.comment.repository.CommentRepository;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    @Transactional
    public Long createComment(LogEntity log, MemberEntity loginUser, CommentCreateRequest request) {
        CommentEntity comment = CommentEntity.builder()
                .content(request.content())
                .member(loginUser)
                .log(log)
                .build();

        return commentRepository.save(comment).getId();
    }

    public CommentEntity findCommentById(Long commentId) {
        return commentRepository.findByIdWithMember(commentId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_COMMENT));
    }

    public List<CommentEntity> getCommentsForLog(Long logId) {
        return commentRepository.findAllByLogIdWithMemberOrderByWrittenAtAsc(logId);
    }

    @Transactional
    public CommentEntity updateComment(CommentEntity comment, CommentUpdateRequest request) {
        comment.updateContent(request.content());
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(CommentEntity comment) {
        commentRepository.delete(comment);
    }

    @Transactional
    public void removeCommentByLog(LogEntity log) {
        commentRepository.deleteByLog(log);
    }

}
