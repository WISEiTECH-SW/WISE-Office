package kr.co.wise.office.api.validation.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import kr.co.wise.office.api.validation.validator.ProjectPeriodValidator.SubjectNotBlankValidator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = SubjectNotBlankValidator.class) // 2단계에서 만들 검증 클래스
public @interface SubjectNotBlank {

    String message() default "{SubjectNotBlank.message}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    String subject(); // XX의 값은 빈 값일 수 없습니다.의 XX 값
}
