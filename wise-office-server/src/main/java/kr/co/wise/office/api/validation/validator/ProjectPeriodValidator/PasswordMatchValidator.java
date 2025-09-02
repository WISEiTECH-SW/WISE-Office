package kr.co.wise.office.api.validation.validator.ProjectPeriodValidator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import kr.co.wise.office.api.validation.annotation.ValidPassword;
import kr.co.wise.office.domain.member.dto.SignupRequest;

public class PasswordMatchValidator implements ConstraintValidator<ValidPassword, SignupRequest> {
    @Override
    public boolean isValid(SignupRequest request, ConstraintValidatorContext context) {
        if (request.password() == null || request.passwordMatch() == null) {
            return true; // null 체크는 @NotNull 같은 다른 validation에서 처리
        }

        boolean equalsPassword = request.password().equals(request.passwordMatch());

        if (!equalsPassword) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("비밀번호와 비밀번호확인이 일치하지 않습니다.")
                    .addPropertyNode("password") // start field에 바인딩
                    .addConstraintViolation();
            return false;
        }
        return true;
    }

}
