package kr.co.wise.office.application;

import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.api.dto.minutes.MinutesDetailResponse;
import kr.co.wise.office.api.dto.minutes.MinutesListResponse;
import kr.co.wise.office.domain.Project.Service.ProjectService;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.service.AttendantService;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.service.MemberService;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.service.MinutesService;
import kr.co.wise.office.domain.minutesattendant.service.MinutesAttendantsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MinutesServiceApi {


    private final AttendantService attendantService;
    private final MemberService memberService;
    private final ProjectService projectService;
    private final MinutesService minutesService;
    private final MinutesAttendantsService minutesAttendantsService ;

    @Transactional(readOnly = true)
    public List<MinutesListResponse> getMinutesBriefInfo(
            long projectId,
            String loginUserEmail
    ) {
        MemberEntity loginUser = memberService.findByEmail(loginUserEmail);
        if (loginUser.isAdmin()) {
            return minutesService.getMinutesBriefInfo(projectId);
        }

        ProjectEntity project = projectService.findById(projectId);
        attendantService.validateParticipatingProject(loginUser, project);
        return minutesService.getMinutesBriefInfo(projectId);
    }

    @Transactional
    public long createMinutes(long projectId, String loginUserEmail, MinutesCreateRequest request) {
        MemberEntity loginUser = memberService.findByEmail(loginUserEmail);
        ProjectEntity project = projectService.findById(projectId);

        // 회의록 작성 권한 확인
        if(!loginUser.isAdmin()){
            attendantService.validateParticipatingProject(loginUser, project);
        }

        // 회의록 작성 번호 확인 => 마지막 회의 번호 + 1
        long currentMinutesNumber = minutesService.getlastMinutesNumber(request.minutesDate()) + 1;
        MinutesEntity minutes = minutesService.createMinutes(project, request, currentMinutesNumber);

        // 회의 참석자 등록
        List<String> attendantNames = Arrays.stream(request.minutesAttendants().split(",")).map(String::trim).toList();
        minutesAttendantsService.createMinutesAttendants(attendantNames, projectId, minutes);

        return minutes.getId();
    }


    @Transactional(readOnly = true)
    public MinutesDetailResponse getMinutesDetailInfo(
            long projectId,
            long minutesId,
            String loginUserEmail
    ) {
        MemberEntity loginUser = memberService.findByEmail(loginUserEmail);
        if (loginUser.isAdmin()) {
            return minutesService.getMinutesDetailInfo(projectId, minutesId);
        }

        ProjectEntity project = projectService.findById(projectId);
        attendantService.validateParticipatingProject(loginUser, project);
        return minutesService.getMinutesDetailInfo(projectId, minutesId);
    }
}
