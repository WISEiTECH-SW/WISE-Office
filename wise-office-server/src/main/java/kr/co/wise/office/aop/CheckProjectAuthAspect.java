package kr.co.wise.office.aop;

import kr.co.wise.office.domain.Project.Service.ProjectService;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.service.AttendantService;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * 특정 작업자가 해당 프로젝트에 참여하고 있는지 확인하는 AOP
 */
@Component
@Aspect
@RequiredArgsConstructor
public class CheckProjectAuthAspect {


    private final MemberService memberService;
    private final ProjectService projectService;
    private final AttendantService attendantService;


    @Around("@annotation(CheckProjectAuth) && args(projectId, loginUserEmail, ..)")
    public Object validateAccess(ProceedingJoinPoint joinPoint, long projectId, String loginUserEmail) throws Throwable {
        MemberEntity loginUser = memberService.findByEmail(loginUserEmail);

        if (!loginUser.isAdmin()) {
            ProjectEntity project = projectService.findById(projectId);
            attendantService.validateParticipatingProject(loginUser, project);
        }

        return joinPoint.proceed();
    }









}
