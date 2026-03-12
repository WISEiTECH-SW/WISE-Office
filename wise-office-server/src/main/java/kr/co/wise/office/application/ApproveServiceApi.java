package kr.co.wise.office.application;

import kr.co.wise.office.aop.CheckProjectAuth;
import kr.co.wise.office.api.dto.approve.*;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.approve.service.ApproveService;
import kr.co.wise.office.domain.minutes.service.MinutesService;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import kr.co.wise.office.external.hoilday.dto.HolidayCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ApproveServiceApi {

    private final ApproveService approveService;

    private final MinutesService minutesService;

    private final HolidayCalculator holidayCalculator;

    /**
     * 해당 프로젝트에 작성된 품의서 목록 조회 메소드
     * 해당 프로젝트에 참여하지 않아도 품의서 목록 조회는 가능
     */
    @Transactional(readOnly = true)
    public List<ApproveListResponse> getApproveList(long projectId) {
        List<ApproveEntity> approves = approveService.getApprovesByProjectId(projectId);
        return approves.stream().map(ApproveListResponse::from).toList();
    }

    /**
     * 품의서 생성 메소드
     * submitDate : 작성일자 및 접수일자
     */
    @CheckProjectAuth
    public ApproveCreateResponse createApprove(long projectId, String loginUserEmail, long minutesId) {
        //품의서 중복 생성 방지
        Optional<ApproveEntity> isApproveCreated = approveService.findByMinutesIdAndProjectId(minutesId, projectId);
        if(isApproveCreated.isPresent()) {
            throw new ApplicationRuntimeException(ErrorMessage.ALREADY_CREATE_APPROVE);
        }

        // 해당 품의서 회의록 회의 일시 조회
        LocalDate minutesDate = minutesService.findMinutesDateByMinutesId(minutesId);

        // 품의서 내 작성일자 / 접수일자 생성
        LocalDate submitDate = holidayCalculator.calculateSubmitDate(minutesDate);
        return approveService.createApprove(minutesId, projectId, submitDate);
    }

    /**
     * 품의서 상세 조회 메소드
     * 해당 프로젝트에 참여하지 않아도 품의서 상세 조회는 가능
     */
    @Transactional(readOnly = true)
    public ApproveDetailResponse getApproveDetail(long approveId) {
        ApproveEntity approveWithMinutes = approveService.getApproveWithMinutes(approveId);
        return ApproveDetailResponse.of(approveWithMinutes.getMinutesEntity(), approveWithMinutes);
    }

    /**
     * 품의서 수정 메소드
     * 프로젝트에 참여한 사람만 수정 가능
     */
    @CheckProjectAuth
    @Transactional
    public ApproveUpdateResponse updateApprove(long projectId, String loginUserEmail, ApproveUpdateRequest request, long approveId) {
        ApproveEntity approveEntity = approveService.updateApprove(projectId, request, approveId);
        return ApproveUpdateResponse.from(approveEntity);
    }



}
