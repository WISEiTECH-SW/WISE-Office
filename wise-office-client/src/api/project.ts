import axios from "axios";

// ============= Project 관련 api =============

/**
 * 프로젝트 정보를 불러오는 함수
 * @returns Project 객체
 */

/**
 * 프로젝트 정보를 수정하는 함수
 * @param projectId 수정할 프로젝트의 ID
 * @param changeLogData 수정할 프로젝트 데이터(title, date)
 * @returns  수정된 project 객체
 */

/**
 * 특정 프로젝트를 삭제하는 함수
 * common으로 이동 가능
 * @param projectId 삭제할 프로젝트의 ID
 */

// ============= Log 관련 api =============

/**
 * 프로젝트 로그 목록을 불러오는 함수
 * @returns Log 배열
 */

/**
 * 새로운 로그를 생성하는 함수
 * @param newLogData 생성할 로그 데이터 (title, content, user)
 * @returns 생성된 Log 객체
 */

/**
 * 특정 로그를 삭제하는 함수
 * @param logId 삭제할 로그의 ID
 */

/**
 * 특정 로그를 수정하는 함수
 * @param logId 수정할 로그의 ID
 * @param changeLogData 수정할 로그 데이터(title, content)
 * @returns  수정된 Log 객체
 */

// ============= Comment 관련 API =============

/**
 * 특정 로그의 댓글 목록을 불러오는 함수
 * @param logId
 * @returns Comment 배열
 */

/**
 * 특정 로그에 댓글을 추가하는 함수
 * @param logId 댓글을 추가할 로그의 ID
 * @param newCommentData 생성할 댓글 데이터 (content, user)
 * @returns 생성된 Comment 객체
 */

/**
 * 특정 댓글을 삭제하는 함수
 * @param logId 댓글이 속한 로그의 ID
 * @param commentId 삭제할 댓글의 ID
 */

// ============= Attendant 관련 API =============

/**
 * 참여자 목록을 불러오는 함수
 * @param projectId
 * @returns Member 배열
 */
