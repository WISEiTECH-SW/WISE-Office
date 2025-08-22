package kr.co.wise.office.api.validation.validator.ProjectPeriodValidator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import kr.co.wise.office.api.validation.annotation.ValidDateRange;
import kr.co.wise.office.domain.Project.dto.ProjectCreateRequest;

public class ProjectCreatePeriodValidator implements ConstraintValidator<ValidDateRange, ProjectCreateRequest> {
    @Override
    public boolean isValid(ProjectCreateRequest request, ConstraintValidatorContext context) {
        if (request.start() == null || request.end() == null) {
            return true; // null 체크는 @NotNull 같은 다른 validation에서 처리
        }

        // 프로젝트 생성일이 종료일 이전인지
        boolean isAfter = request.start().isAfter(request.end());

        if (isAfter) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("시작일은 종료일보다 이후일 수 없습니다")
                    .addPropertyNode("start") // start field에 바인딩
                    .addConstraintViolation();
            return false;
        }
        return true; // 시작이 종료 이후면 false
    }

}
