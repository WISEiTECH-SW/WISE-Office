package kr.co.wise.office.application;

import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.Log.service.LogService;
import kr.co.wise.office.domain.Project.Service.ProjectService;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantRoleType;
import kr.co.wise.office.domain.attendant.service.AttendantService;
import kr.co.wise.office.domain.comment.dto.CommentCreateRequest;
import kr.co.wise.office.domain.comment.dto.CommentResponse;
import kr.co.wise.office.domain.comment.dto.CommentUpdateRequest;
import kr.co.wise.office.domain.comment.dto.CommentUpdateResponse;
import kr.co.wise.office.domain.comment.entity.CommentEntity;
import kr.co.wise.office.domain.comment.service.CommentService;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.domain.member.service.MemberService;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.UnAuthorizationException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.function.Function;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class CommentServiceApi {

    private final AttendantService attendantService;
    private final CommentService commentService;
    private final MemberService memberService;
    private final LogService logService;
    private final ProjectService projectService;

    @Transactional
    public CommentResponse createComment(long projectId, long logId, String loginEmail, CommentCreateRequest request) {
        MemberEntity loginUser = memberService.findByEmail(loginEmail);

        //권한 확인
        if(!isAdmin(loginUser)){
            ProjectEntity project = projectService.findById(projectId);
            attendantService.validateParticipatingProject(loginUser, project);
        }

        LogEntity log = logService.searchLog(logId);
        CommentEntity newComment = commentService.createComment(log, loginUser, request);

        return CommentResponse.from(newComment, true);
    }

    public List<CommentResponse> getCommentsForLog(long projectId, long logId, String userEmail) {
        MemberEntity loginUser = memberService.findByEmail(userEmail);
        logService.searchLog(logId);
        ProjectEntity project = projectService.findById(projectId);
        List<CommentEntity> commentsForLog = commentService.getCommentsForLog(logId);

        Function<CommentEntity, Boolean> modifyChecker;
        if(isAdmin(loginUser)){
            modifyChecker = comment -> true;
        } else {
            attendantService.validateParticipatingProject(loginUser, project);
            modifyChecker = comment -> canModifyComment(loginUser, project, comment);
        }

        return commentsForLog.stream()
                .map(comment -> CommentResponse.from(comment, modifyChecker.apply(comment)))
                .toList();
    }

    @Transactional
    public CommentUpdateResponse updateComment(long projectId, long commentId, String userEmail, CommentUpdateRequest request) {
        CommentEntity comment = getCommentIfAuthorized(projectId, commentId, userEmail);
        CommentEntity updateComment = commentService.updateComment(comment, request);
        return new CommentUpdateResponse(updateComment.getContent());
    }

    @Transactional
    public void removeComment(long projectId, long commentId, String userEmail) {
        CommentEntity comment = getCommentIfAuthorized(projectId, commentId, userEmail);
        commentService.deleteComment(comment);
    }

    private CommentEntity getCommentIfAuthorized(long projectId, long commentId, String userEmail) {
        MemberEntity loginUser = memberService.findByEmail(userEmail);
        ProjectEntity project = projectService.findById(projectId);
        CommentEntity comment = commentService.findCommentById(commentId);

        if (!canModifyComment(loginUser, project, comment)) {
            throw new UnAuthorizationException(ErrorMessage.REJECT_MODIFYING_COMMENT);
        }

        return comment;
    }

    private boolean canModifyComment(MemberEntity loginUser, ProjectEntity project, CommentEntity comment) {
        if (isAdmin(loginUser)) {
            return true;
        }

        AttendantEntity attendant = attendantService.validateParticipatingProject(loginUser, project);
        boolean isPM = attendant.getRole().equals(AttendantRoleType.PM); // PM 확인
        boolean isWriter = comment.getMember().getId().equals(loginUser.getId()); // 작성자인지 확인

        return isPM || isWriter;
    }

    private boolean isAdmin(MemberEntity loginUser) {
        // ADMIN 권한 확인
        return loginUser.getRoleType().equals(MemberRoleType.MASTER);
    }


}
