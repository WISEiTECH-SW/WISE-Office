package kr.co.wise.office.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.wise.office.application.CommentServiceApi;
import kr.co.wise.office.domain.comment.dto.CommentCreateRequest;
import kr.co.wise.office.domain.comment.dto.CommentResponse;
import kr.co.wise.office.domain.comment.dto.CommentUpdateRequest;
import kr.co.wise.office.domain.comment.dto.CommentUpdateResponse;
import kr.co.wise.office.domain.member.dto.CustomOAuthUser;
import kr.co.wise.office.exception.dto.ErrorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Comment", description = "댓글 CRUD API 명세입니다.")
@RequestMapping("/api/v1/projects/{projectId}/logs/{logId}/comments")
public class CommentController {

    private final CommentServiceApi commentService;

    @Operation(summary = "댓글 생성", description = "특정 로그에 댓글을 생성합니다.",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "댓글 생성 성공"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 로그 또는 멤버",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<Long> createComment(
            @Parameter(description = "프로젝트 ID") @PathVariable Long projectId,
            @Parameter(description = "로그 ID") @PathVariable Long logId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @RequestBody CommentCreateRequest request) {

        Long commentId = commentService.createComment(projectId, logId, loginUser.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentId);
    }

    @Operation(summary = "댓글 목록 조회", description = "특정 로그의 모든 댓글을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글 목록 조회 성공"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 멤버",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(
            @Parameter(description = "프로젝트 ID") @PathVariable Long projectId,
            @Parameter(description = "로그 ID") @PathVariable Long logId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser) {
        
        List<CommentResponse> comments = commentService.getCommentsForLog(projectId, logId, loginUser.getName());
        return ResponseEntity.status(HttpStatus.OK).body(comments);
    }

    @Operation(summary = "댓글 수정", description = "댓글을 수정합니다.",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글 수정 성공"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 댓글 또는 멤버",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "댓글 수정 권한 없음",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/{commentId}")
    public ResponseEntity<CommentUpdateResponse> updateComment(
            @Parameter(description = "프로젝트 ID") @PathVariable Long projectId,
            @Parameter(description = "로그 ID") @PathVariable Long logId,
            @Parameter(description = "댓글 ID") @PathVariable Long commentId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser,
            @RequestBody CommentUpdateRequest request) {

        CommentUpdateResponse commentUpdateResponse = commentService.updateComment(projectId, commentId, loginUser.getName(), request);
        return ResponseEntity.status(HttpStatus.OK).body(commentUpdateResponse);
    }

    @Operation(summary = "댓글 삭제", description = "댓글을 삭제합니다.",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "댓글 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 댓글 또는 멤버",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "댓글 삭제 권한 없음",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @Parameter(description = "프로젝트 ID") @PathVariable Long projectId,
            @Parameter(description = "로그 ID") @PathVariable Long logId,
            @Parameter(description = "댓글 ID") @PathVariable Long commentId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuthUser loginUser) {

        commentService.removeComment(projectId, commentId, loginUser.getName());
        return ResponseEntity.noContent().build();
    }
}