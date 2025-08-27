package kr.co.wise.office.application;

import kr.co.wise.office.domain.Log.dto.LogCreateRequest;
import kr.co.wise.office.domain.Log.dto.LogDetailResponse;
import kr.co.wise.office.domain.Log.dto.LogListResponse;
import kr.co.wise.office.domain.Log.dto.LogUpdateRequest;
import kr.co.wise.office.domain.comment.dto.CommentCreateRequest;
import kr.co.wise.office.domain.comment.dto.CommentResponse;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import kr.co.wise.office.exception.custom.UnAuthorizationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class LogServiceApiTest extends BaseTestEntity {

    @Autowired
    private LogServiceApi logServiceApi;
    @Autowired
    private CommentServiceApi commentServiceApi;

    private final String defaultLogTitle = "log title";
    private final String defaultLogContent = "log content";
    private final LogCreateRequest defaultLogRequest = new LogCreateRequest(defaultLogTitle, defaultLogContent);

    private final String defaultComment = "comment";
    private final CommentCreateRequest defaultCommentRequest = new CommentCreateRequest(defaultComment);

    private LogDetailResponse createLog(String email) {
        return logServiceApi.createLog(email, projectId, defaultLogRequest);
    }

    @Test
    @DisplayName("생성된 프로젝트의 로그는 해당 프로젝트 참여자 및 ADMIN 유저만 가능하다.")
    void createLog_withProjectMembersAndAdmin_success() {
        // given

        // when
        logServiceApi.createLog(pmInfo.email, projectId, defaultLogRequest);
        logServiceApi.createLog(workerInfo1.email, projectId, defaultLogRequest);
        logServiceApi.createLog(workerInfo2.email, projectId, defaultLogRequest);
        logServiceApi.createLog(adminInfo.email, projectId, defaultLogRequest);

        //then
        List<LogListResponse> adminResponses = logServiceApi.getAllLogs(projectId, adminInfo.email);
        assertThat(adminResponses.size()).isEqualTo(4);
        assertThat(adminResponses).extracting(LogListResponse::canModify).containsExactly(true, true, true, true).as("ADMIN은 모든 로그를 수정할 수 있음");

        List<LogListResponse> pmResponses = logServiceApi.getAllLogs(projectId, pmInfo.email);
        assertThat(pmResponses).extracting(LogListResponse::canModify).containsExactly(true, true, true, true).as("PM은 모든 로그를 수정할 수 있음");
    }

    @Test
    @DisplayName("프로젝트에 참여중이지 않은 사람이 로그 작성시 예외가 발생해야 한다.")
    void createLog_notInProject_shouldThrow() {
        //given
        MemberCreationInfo anonymousInfo = new MemberCreationInfo("anonymous", "anoynmous@test.co.kr");
        MemberEntity anonymous = createMember(anonymousInfo.email, anonymousInfo.name, MemberRoleType.WORKER);
        //when + then
        assertThatThrownBy(() -> logServiceApi.createLog(anonymous.getEmail(), projectId, defaultLogRequest)).isInstanceOf(NotFoundResourceException.class);
    }

    @Test
    @DisplayName("ADMIN은 자신이 작성하지 않은 로그도 수정할 수 있다")
    void updateLog_withAdminRole_canModifyAnyLog(){
        //given
        LogDetailResponse logResponse1 = createLog(workerInfo1.email);
        LogDetailResponse logResponse2 = createLog(workerInfo2.email);
        final String updateTitle = "update title";
        final String updateContent = "update content";
        LogUpdateRequest updateRequest = new LogUpdateRequest(updateTitle, updateContent);

        //when
        LogDetailResponse updateResponse1 = logServiceApi.updateLog(projectId, logResponse1.logId(), adminInfo.email, updateRequest);
        LogDetailResponse logDetail2 = logServiceApi.getDetailLog(logResponse2.logId(), projectId, adminInfo.email);

        //then
        assertThat(updateResponse1.title()).isEqualTo(updateRequest.title()).as("수정 후 요청 제목과 같아야 함");
        assertThat(updateResponse1.content()).isEqualTo(updateRequest.content()).as("수정 후 요청 본문과 같아야 함");
        assertThat(updateResponse1.canModify()).isTrue().as("수정 후에도 삭제가 가능해야 함");
        assertThat(logDetail2.title()).isEqualTo("log title").as("수정하지 않은 로그 제목에는 변화가 없어야 함");
        assertThat(logDetail2.content()).isEqualTo("log content").as("수정하지 않은 로그 제목에는 변화가 없어야 함");
        assertThat(logDetail2.canModify()).isTrue().as("수정 후에도 삭제가 가능해야 함");
    }

    @Test
    @DisplayName("ADMIN은 어떤 로그든 삭제할 수 있다.")
    void deleteLog_withAdminRole_canDeleteAnyLog(){
        //given
        LogDetailResponse logResponse1 = createLog(workerInfo1.email);
        LogDetailResponse logResponse2 = createLog(workerInfo2.email);
        logServiceApi.removeLog(projectId, logResponse1.logId(), adminInfo.email);
        logServiceApi.removeLog(projectId, logResponse2.logId(), adminInfo.email);

        //when
        List<LogListResponse> responses = logServiceApi.getAllLogs(projectId, adminInfo.email);

        //then
        assertThat(responses.size()).isEqualTo(0).as("모든 로그를 삭제했으므로 0개가 조회되어야 함");
    }

    @Test
    @DisplayName("PM은 프로젝트내 자신이 작성하지 않은 로그도 수정할 수 있다")
    void updateLog_withPmRole_canModifyAnyLog(){
        //given
        LogDetailResponse logResponse1 = createLog(workerInfo1.email);
        LogDetailResponse logResponse2 = createLog(workerInfo2.email);
        final String updateTitle = "update title";
        final String updateContent = "update content";
        LogUpdateRequest updateRequest = new LogUpdateRequest(updateTitle, updateContent);

        //when
        LogDetailResponse updateResponse1 = logServiceApi.updateLog(projectId, logResponse1.logId(), pmInfo.email, updateRequest);
        LogDetailResponse logDetail2 = logServiceApi.getDetailLog(logResponse2.logId(), projectId, pmInfo.email);

        //then
        assertThat(updateResponse1.title()).isEqualTo(updateRequest.title()).as("수정 후 요청 제목과 같아야 함");
        assertThat(updateResponse1.content()).isEqualTo(updateRequest.content()).as("수정 후 요청 본문과 같아야 함");
        assertThat(updateResponse1.canModify()).isTrue().as("수정 후에도 삭제가 가능해야 함");
        assertThat(logDetail2.title()).isEqualTo("log title").as("수정하지 않은 로그 제목에는 변화가 없어야 함");
        assertThat(logDetail2.content()).isEqualTo("log content").as("수정하지 않은 로그 제목에는 변화가 없어야 함");
        assertThat(logDetail2.canModify()).isTrue().as("수정 후에도 삭제가 가능해야 함");
    }

    @Test
    @DisplayName("PM은 프로젝트 내의 어떤 로그든 삭제할 수 있다")
    void deleteLog_withPmRole_canDeleteAnyLog(){
        //given
        LogDetailResponse logResponse1 = createLog(workerInfo1.email);
        LogDetailResponse logResponse2 = createLog(workerInfo2.email);
        logServiceApi.removeLog(projectId, logResponse1.logId(), pmInfo.email);
        logServiceApi.removeLog(projectId, logResponse2.logId(), pmInfo.email);

        //when
        List<LogListResponse> responses = logServiceApi.getAllLogs(projectId, pmInfo.email);

        //then
        assertThat(responses.size()).isEqualTo(0).as("모든 로그를 삭제했으므로 0개가 조회되어야 함");
    }

    @DisplayName("worker는 자신이 작성한 로그만 수정할 수 있다")
    @Test
    void updateLog_withWorkerRole_canModifyOwnLog(){
        // given
        LogDetailResponse logResponse1 = createLog(workerInfo1.email);
        LogDetailResponse logResponse2 = createLog(workerInfo2.email);
        final String updateTitle = "update title";
        final String updateContent = "update content";
        LogUpdateRequest updateRequest = new LogUpdateRequest(updateTitle, updateContent);

        //when
        LogDetailResponse updateResponse1 = logServiceApi.updateLog(projectId, logResponse1.logId(), workerInfo1.email, updateRequest);
        LogDetailResponse logDetail2 = logServiceApi.getDetailLog(logResponse2.logId(), projectId, workerInfo1.email);

        //then
        assertThat(updateResponse1.title()).isEqualTo(updateRequest.title()).as("수정 후 요청 제목과 같아야 함");
        assertThat(updateResponse1.content()).isEqualTo(updateRequest.content()).as("수정 후 요청 본문과 같아야 함");
        assertThat(updateResponse1.canModify()).isTrue().as("worker는 자신이 작성한 로그는 또 수정할 수 있음");
        assertThat(logDetail2.title()).isEqualTo("log title").as("수정하지 않은 로그 제목에는 변화가 없어야 함");
        assertThat(logDetail2.content()).isEqualTo("log content").as("수정하지 않은 로그 제목에는 변화가 없어야 함");
        assertThat(logDetail2.canModify()).isFalse().as("worker는 자신이 작성한 로그만 수정할 수 있음");
    }

    @DisplayName("worker는 다른 사람이 작성한 로그를 수정할 수 없다")
    @Test
    void updateLog_withWorkerRole_cannotModifyOtherLog(){
        // given
        LogDetailResponse logResponse1 = createLog(workerInfo1.email);
        LogDetailResponse logResponse2 = createLog(workerInfo2.email);
        final String updateTitle = "update title";
        final String updateContent = "update content";
        LogUpdateRequest updateRequest = new LogUpdateRequest(updateTitle, updateContent);

        //when
        LogDetailResponse updateResponse1 = logServiceApi.updateLog(projectId, logResponse1.logId(), workerInfo1.email, updateRequest);
        LogDetailResponse logDetail2 = logServiceApi.getDetailLog(logResponse2.logId(), projectId, workerInfo1.email);

        //then
        assertThatThrownBy(() -> logServiceApi.updateLog(projectId, logResponse2.logId(), workerInfo1.email, updateRequest))
                .isInstanceOf(UnAuthorizationException.class)
                .extracting("errorMessage")
                .isEqualTo(ErrorMessage.REJECT_MODIFYING_LOG);
        assertThat(logDetail2.canModify()).isFalse().as("자신이 작성한 로그는 수정할 수 없음.");
    }

    @DisplayName("worker는 다른 사람이 작성한 로그를 삭제 수 없다")
    @Test
    void deleteLog_withWorkerRole_cannotDeleteOtherLog(){
        // given
        LogDetailResponse logResponse1 = createLog(workerInfo1.email);
        LogDetailResponse logResponse2 = createLog(workerInfo2.email);
        final String updateTitle = "update title";
        final String updateContent = "update content";
        LogUpdateRequest updateRequest = new LogUpdateRequest(updateTitle, updateContent);

        //when + then
        assertThatThrownBy(() -> logServiceApi.removeLog(projectId, logResponse2.logId(), workerInfo1.email))
                .isInstanceOf(UnAuthorizationException.class)
                .extracting("errorMessage")
                .isEqualTo(ErrorMessage.REJECT_MODIFYING_LOG);
    }

    @DisplayName("로그 리스트 조회시 삭제된 댓글은 계산에 포함되면 안된다.")
    @Test
    void notContain_deleteComment_calculatingSum() {
        //given
        LogDetailResponse log = createLog(workerInfo1.email);
        LogDetailResponse log2 = createLog(workerInfo2.email);
        commentServiceApi.createComment(projectId, log.logId(), adminInfo.email, defaultCommentRequest);
        CommentResponse removeComment1 = commentServiceApi.createComment(projectId, log.logId(), workerInfo1.email, defaultCommentRequest);
        CommentResponse removeComment2 = commentServiceApi.createComment(projectId, log.logId(), workerInfo2.email, defaultCommentRequest);
        commentServiceApi.createComment(projectId, log.logId(), pmInfo.email, defaultCommentRequest);
        CommentResponse removeComment3 = commentServiceApi.createComment(projectId, log.logId(), workerInfo2.email, defaultCommentRequest);
        commentServiceApi.removeComment(projectId, removeComment1.id(), pmInfo.email);
        commentServiceApi.removeComment(projectId, removeComment2.id(), adminInfo.email);
        commentServiceApi.removeComment(projectId, removeComment3.id(), workerInfo2.email);

        commentServiceApi.createComment(projectId, log2.logId(), adminInfo.email, defaultCommentRequest);
        commentServiceApi.createComment(projectId, log2.logId(), adminInfo.email, defaultCommentRequest);
        commentServiceApi.createComment(projectId, log2.logId(), adminInfo.email, defaultCommentRequest);

        em.flush();
        em.clear();;

        //when
        List<LogListResponse> responses = logServiceApi.getAllLogs(projectId, workerInfo1.email);

        //then
        assertThat(responses.size()).as("로그는 두개가 조회되어야 함").isEqualTo(2);
        assertThat(responses).as("첫 번째 로그에는 2개, 두 번째 로그에는 댓글 개수 3개가 조회되어야 함")
                .extracting("commentCnt").containsExactlyInAnyOrder(2, 3);
    }
}
