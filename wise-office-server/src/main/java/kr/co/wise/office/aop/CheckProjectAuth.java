package kr.co.wise.office.aop;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 현재 로그인한 유저가 해당 프로젝트에 참여 중인지 확인하는 어노테이션
 * 해당 어노테이션 사용시 메소드 파라미터 순서를
 * projectId(long). 현재 로그인한 유저의 이메일 (string) 순으로 작성해야 합니다.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface CheckProjectAuth {
}
