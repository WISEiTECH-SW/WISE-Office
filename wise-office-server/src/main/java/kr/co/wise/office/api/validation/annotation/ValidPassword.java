package kr.co.wise.office.api.validation.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import kr.co.wise.office.api.validation.validator.ProjectPeriodValidator.PasswordMatchValidator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {PasswordMatchValidator.class})
public @interface ValidPassword {

    String message() default "비밀번호가 일치하지 않습니다.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
