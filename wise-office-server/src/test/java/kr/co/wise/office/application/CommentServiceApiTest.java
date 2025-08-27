package kr.co.wise.office.application;


import kr.co.wise.office.domain.Log.dto.LogCreateRequest;
import kr.co.wise.office.domain.Log.dto.LogDetailResponse;
import kr.co.wise.office.domain.comment.dto.CommentCreateRequest;
import kr.co.wise.office.domain.comment.dto.CommentResponse;
import kr.co.wise.office.domain.comment.dto.CommentUpdateRequest;
import kr.co.wise.office.domain.comment.dto.CommentUpdateResponse;
import kr.co.wise.office.domain.comment.entity.CommentEntity;
import kr.co.wise.office.domain.comment.repository.CommentRepository;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import kr.co.wise.office.exception.custom.UnAuthorizationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class CommentServiceApiTest extends BaseTestEntity {

    @Autowired
    private CommentServiceApi commentServiceApi;
    @Autowired
    private LogServiceApi logServiceApi;
    @Autowired
    private CommentRepository commentRepository;

    private long logId;

    private final String defaultCommentContent = "comment content";
    private CommentCreateRequest defaultCommentRequest;

    @BeforeEach
    void setUp() {
        super.setUp();
        LogCreateRequest logRequest = new LogCreateRequest("log", "content");
        LogDetailResponse logResponse = logServiceApi.createLog(workerInfo1.email, this.projectId, logRequest);
        this.logId = logResponse.logId();
        this.defaultCommentRequest = new CommentCreateRequest(defaultCommentContent);
    }

    private CommentResponse createComment(String email) {
        return commentServiceApi.createComment(projectId, logId, email, defaultCommentRequest);
    }

    @Test
    @DisplayName("생성된 프로젝트의 댓글은 해당 프로젝트 참여자 및 ADMIN 유저만 가능하다.")
    void createComment_withProjectMembersAndAdmin_success() {
        // given

        // when
        commentServiceApi.createComment(projectId, logId, pmInfo.email, defaultCommentRequest);
        commentServiceApi.createComment(projectId, logId, workerInfo1.email, defaultCommentRequest);
        commentServiceApi.createComment(projectId, logId, workerInfo2.email, defaultCommentRequest);
        commentServiceApi.createComment(projectId, logId, adminInfo.email, defaultCommentRequest);
        em.flush();
        em.clear();

        //then
        List<CommentResponse> adminResponses = commentServiceApi.getCommentsForLog(projectId, logId, adminInfo.email);
        assertThat(adminResponses.size()).isEqualTo(4);
        assertThat(adminResponses).extracting(CommentResponse::canModify)
                .as("ADMIN은 모든 댓글을 수정할 수 있음").containsExactly(true, true, true, true);
        assertThat(adminResponses).extracting("content").containsExactly(defaultCommentContent, defaultCommentContent, defaultCommentContent, defaultCommentContent);
        List<CommentResponse> pmResponses = commentServiceApi.getCommentsForLog(projectId, logId, pmInfo.email);
        assertThat(pmResponses).extracting(CommentResponse::canModify)
                .as("PM은 모든 댓글을 수정할 수 있음").containsExactly(true, true, true, true);
    }

    @Test
    @DisplayName("프로젝트에 참여중이지 않은 사람이 댓글 작성시 예외가 발생해야 한다.")
    void createComment_notInProject_shouldThrow() {
        //given
        MemberCreationInfo anonymousInfo = new MemberCreationInfo("anonymous", "anoynmous@test.co.kr");
        MemberEntity anonymous = createMember(anonymousInfo.email, anonymousInfo.name, MemberRoleType.WORKER);

        //when + then
        assertThatThrownBy(() -> commentServiceApi.createComment(projectId, logId, anonymous.getEmail(), defaultCommentRequest))
                .isInstanceOf(NotFoundResourceException.class)
                .extracting("errorMessage")
                .isEqualTo(ErrorMessage.NOT_FOUND_ATTENDANT);
    }

    @Test
    @DisplayName("Worker는 자신이 작성한 댓글만 삭제할 수 있다")
    void removeComment_withWorkerRole_canModifyOwnLog(){
        //given
        String worker1Email = workerInfo1.email;
        String otherWorkerEmail = workerInfo2.email;
        CommentResponse comment1 = createComment(worker1Email);
        CommentResponse comment2 = createComment(otherWorkerEmail);

        //when
        commentServiceApi.removeComment(projectId, comment1.id(), worker1Email);
        List<CommentResponse> commentsForLog = commentServiceApi.getCommentsForLog(projectId, logId, worker1Email);

        //then
        assertThat(commentsForLog.size()).isEqualTo(1);
        assertThatThrownBy(() -> commentServiceApi.removeComment(projectId, comment2.id(), worker1Email))
                .as("다른 사람이 작성한 댓글 삭제시 에러 발생")
                .isInstanceOf(UnAuthorizationException.class)
                .extracting("errorMessage")
                .isEqualTo(ErrorMessage.REJECT_MODIFYING_COMMENT);
    }

    @Test
    @DisplayName("Worker는 자신이 작성한 댓글만 수정할 수 있다")
    void updateComment_withWorkerRole_canModifyOwnLog(){
        //given
        String worker1Email = workerInfo1.email;
        String otherWorkerEmail = workerInfo2.email;
        CommentResponse comment1 = createComment(worker1Email);
        CommentResponse comment2 = createComment(otherWorkerEmail);

        CommentUpdateRequest request = new CommentUpdateRequest("update comment");
        //when
        CommentUpdateResponse updateResponse = commentServiceApi.updateComment(projectId, comment1.id(), worker1Email, request);

        CommentEntity updateComment = commentRepository.findById(comment1.id()).get();

        //then
        assertThat(updateComment.getContent()).as("업데이트된 내용은 요청 내용과 같아야 함").isEqualTo(request.content());
        assertThatThrownBy(() -> commentServiceApi.removeComment(projectId, comment2.id(), worker1Email))
                .as("다른 사람이 작성한 댓글 수정시 에러 발생")
                .isInstanceOf(UnAuthorizationException.class)
                .extracting("errorMessage")
                .isEqualTo(ErrorMessage.REJECT_MODIFYING_COMMENT);
    }

    @DisplayName("프로젝트 관리자(PM) 및 ADMIN 유저는 프로젝트 내의 모든 댓글을 수정할 수 있다.")
    @ParameterizedTest
    @ValueSource(strings = {"pm@test.co.kr", "admin@test.co.kr"})
    void updateComment_withManagerRole_canModifyAnyLog(String managerEmail) {
        //given
        String worker1Email = workerInfo1.email;
        String otherWorkerEmail = workerInfo2.email;
        CommentResponse comment1 = createComment(worker1Email);
        CommentResponse comment2 = createComment(otherWorkerEmail);
        String updateContent1 = "update comment1";
        String updateContent2 = "update comment2";
        CommentUpdateRequest request1 = new CommentUpdateRequest(updateContent1);
        CommentUpdateRequest request2 = new CommentUpdateRequest(updateContent2);

        //when
        commentServiceApi.updateComment(projectId, comment1.id(), managerEmail, request1);
        commentServiceApi.updateComment(projectId, comment2.id(), managerEmail, request2);

        //then
        CommentEntity commentEntity1 = commentRepository.findById(comment1.id()).get();
        CommentEntity commentEntity2 = commentRepository.findById(comment2.id()).get();
        assertThat(commentEntity1.getContent()).isEqualTo(request1.content());
        assertThat(commentEntity2.getContent()).isEqualTo(request2.content());
    }

    @DisplayName("프로젝트 관리자(PM) 및 ADMIN 유저는 프로젝트 내의 모든 댓글을 삭제할 수 있다.")
    @ParameterizedTest
    @ValueSource(strings = {"pm@test.co.kr", "admin@test.co.kr"})
    void deleteComment_withManagerRole_canModifyAnyLog(String managerEmail) {
        //given
        String worker1Email = workerInfo1.email;
        String otherWorkerEmail = workerInfo2.email;
        CommentResponse comment1 = createComment(worker1Email);
        CommentResponse comment2 = createComment(otherWorkerEmail);
        CommentResponse notRemoveComment = createComment(worker1Email);

        //when
        commentServiceApi.removeComment(projectId, comment1.id(), managerEmail);
        commentServiceApi.removeComment(projectId, comment2.id(), managerEmail);
        em.flush();
        em.clear();

        //then
        List<CommentResponse> commentsForLog = commentServiceApi.getCommentsForLog(projectId, logId, worker1Email);
        assertThat(commentsForLog.size()).as("3개중에 2개가 식제됐으므로 하나가 남아야 함").isEqualTo(1);
        assertThat(commentsForLog).extracting("content")
                .as("남은 하나는 notRemoveComment의 내용과 같아야 함")
                .isEqualTo(List.of(notRemoveComment.content()));
    }
}
