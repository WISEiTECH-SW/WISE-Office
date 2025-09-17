package kr.co.wise.office.api.validation.validator.ProjectPeriodValidator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import kr.co.wise.office.api.validation.annotation.SubjectNotBlank;
import org.springframework.util.StringUtils;

public class SubjectNotBlankValidator implements ConstraintValidator<SubjectNotBlank, String> {
    @Override
    public boolean isValid(String input, ConstraintValidatorContext context) {
        return StringUtils.hasText(input);
    }
}
