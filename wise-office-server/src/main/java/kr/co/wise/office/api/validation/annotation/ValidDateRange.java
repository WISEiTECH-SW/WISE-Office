package kr.co.wise.office.api.validation.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import kr.co.wise.office.api.validation.validator.ProjectPeriodValidator.ProjectCreatePeriodValidator;
import kr.co.wise.office.api.validation.validator.ProjectPeriodValidator.ProjectUpdatePeriodValidator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {ProjectCreatePeriodValidator.class, ProjectUpdatePeriodValidator.class}) // 유효성 검사를 수행할 클래스 지정
public @interface ValidDateRange {

    String message() default "종료 날짜는 시작 날짜보다 빠를 수 없습니다.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}