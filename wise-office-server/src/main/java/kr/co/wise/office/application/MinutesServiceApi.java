package kr.co.wise.office.application;

import kr.co.wise.office.aop.CheckProjectAuth;
import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.api.dto.minutes.MinutesDetailResponse;
import kr.co.wise.office.api.dto.minutes.MinutesListResponse;
import kr.co.wise.office.api.dto.minutes.MinutesUpdateRequest;
import kr.co.wise.office.domain.Project.Service.ProjectService;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.approve.service.ApproveService;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.service.MinutesService;
import kr.co.wise.office.domain.minutesattendant.service.MinutesAttendantsService;
import kr.co.wise.office.external.hoilday.dto.HolidayCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MinutesServiceApi {


    private final ProjectService projectService;
    private final MinutesService minutesService;
    private final MinutesAttendantsService minutesAttendantsService ;
    private final ApproveService approveService;

    private final HolidayCalculator holidayCalculator;

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
        minutesAttendantsService.createMinutesAttendants(request, projectId, minutes);

        return MinutesDetailResponse.from(minutes, request.minutesAttendants(), null);
    }

    @Transactional(readOnly = true)
    public MinutesDetailResponse getMinutesDetailInfo(
            long minutesId,
            long projectId) {
        return minutesService.getMinutesDetailInfo(minutesId, projectId);
    }


    @CheckProjectAuth
    @Transactional
    public MinutesDetailResponse updateMinutes(long projectId, String loginUserEmail, long minutesId, MinutesUpdateRequest request) {
        // 회의록 수정
        MinutesEntity minutes = minutesService.getMinutesInfoWithProject(minutesId, projectId);
        minutes.update(request);

        // 참여 인력 수정
        minutesAttendantsService.updateMinutesAttendants(minutes, request.minutesAttendants(), request.writer(),  projectId);

        // 품의서 수정
        Optional<ApproveEntity> approveEntity = approveService.findByMinutesIdAndProjectId(minutesId, projectId);
        if (approveEntity.isEmpty()) {
            return MinutesDetailResponse.from(minutes, request.minutesAttendants(), null);
        }

        ApproveEntity approve = approveEntity.get();
        LocalDate changeApproveWrittenDate = holidayCalculator.calculateSubmitDate(request.minutesDate());
        approve.updateApprove(minutes, changeApproveWrittenDate);

        return MinutesDetailResponse.from(minutes, request.minutesAttendants(), approve.getId());
    }


    @CheckProjectAuth
    @Transactional
    public void removeMinutesWithApprove(long projectId, String name, long minutesId) {
        //품의서 삭제
        approveService.deleteApprove(projectId, minutesId);
        //회의 참여 인원 삭제
        minutesAttendantsService.deleteAttendants(minutesId);
        //회의록 삭제
        minutesService.deleteMinutes(projectId, minutesId);
    }
}
