package kr.co.wise.office.application;

import kr.co.wise.office.aop.CheckProjectAuth;
import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.api.dto.minutes.MinutesDetailResponse;
import kr.co.wise.office.api.dto.minutes.MinutesListResponse;
import kr.co.wise.office.domain.Project.Service.ProjectService;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.service.MinutesService;
import kr.co.wise.office.domain.minutesattendant.service.MinutesAttendantsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MinutesServiceApi {


    private final ProjectService projectService;
    private final MinutesService minutesService;
    private final MinutesAttendantsService minutesAttendantsService ;

    public List<MinutesListResponse> getMinutesBriefInfo(
            long projectId,
            String loginUserEmail
    ) {
        return minutesService.getMinutesBriefInfo(projectId);
    }

    @CheckProjectAuth
    @Transactional
    public MinutesDetailResponse createMinutes(long projectId, String loginUserEmail, MinutesCreateRequest request) {
        // 회의록 작성 번호 확인 => 마지막 회의 번호 + 1
        ProjectEntity project = projectService.findById(projectId);
        long currentMinutesNumber = minutesService.countByMinutesDate(request.minutesDate()) + 1;
        MinutesEntity minutes = minutesService.createMinutes(project, request, currentMinutesNumber);

        // 회의 참석자 등록
        List<String> attendantNames = new ArrayList<>(Arrays.stream(request.minutesAttendants().split(",")).map(String::trim).toList());
        attendantNames.add(request.writer()); // 회의록 작성자도 추가
        minutesAttendantsService.createMinutesAttendants(attendantNames, projectId, minutes);

        return MinutesDetailResponse.from(minutes, request.minutesAttendants());
    }

    @Transactional(readOnly = true)
    public MinutesDetailResponse getMinutesDetailInfo(
            long minutesId,
            long projectId) {
        return minutesService.getMinutesDetailInfo(minutesId, projectId);
    }


}
