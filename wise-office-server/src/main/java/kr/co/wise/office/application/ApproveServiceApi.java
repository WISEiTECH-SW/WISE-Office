package kr.co.wise.office.application;

import kr.co.wise.office.aop.CheckProjectAuth;
import kr.co.wise.office.api.dto.approve.*;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.approve.service.ApproveService;
import kr.co.wise.office.domain.minutes.service.MinutesService;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import kr.co.wise.office.external.hoilday.HolidayProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ApproveServiceApi {

    private final ApproveService approveService;

    private final MinutesService minutesService;

    private final HolidayProvider holidayProvider;

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
        boolean isApproveCreated = approveService.existsByMinutesId(minutesId, projectId);
        if(isApproveCreated) {
            throw new ApplicationRuntimeException(ErrorMessage.ALREADY_CREATE_APPROVE);
        }

        // 해당 품의서 회의록 회의 일시 조회
        LocalDate minutesDate = minutesService.findMinutesDateByMinutesId(minutesId);

        // 품의서 내 작성일자 / 접수일자 생성
        LocalDate submitDate = calculateSubmitDate(minutesDate);
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

    /**
     * 작성일자 및 접수일자 계산
     * 두 일자는 회의록 작성 전날 중, 휴일 및 공휴일이 아닌 평일로 계산
     * 예를 들어 회의 날짜가 2026년 3월 3일인 경우,
     * 3월 2일은 임시 공휴일, 3월 1일, 3월 2일은 주말이므로
     * 기안날짜는 2월 27일어야 함.
     */
    private LocalDate calculateSubmitDate(LocalDate minutesDate) {
        Set<LocalDate> holidaySet = holidayProvider.getHolidaySet(minutesDate.getYear(), minutesDate.getMonthValue());
        LocalDate startDate = minutesDate;
        LocalDate submitDate = minutesDate.minusDays(1);
        while (isWeekend(submitDate) || holidaySet.contains(submitDate)) {
            submitDate = submitDate.minusDays(1);

            // 월이 바뀌는 경우 계산
            if (submitDate.getMonthValue() < startDate.getMonthValue()) {
                holidaySet = holidayProvider.getHolidaySet(submitDate.getYear(), submitDate.getMonthValue());
                startDate = submitDate;
            }
        }
        return submitDate;
    }

    private boolean isWeekend(LocalDate submitDate) {
        DayOfWeek dayOfWeek = submitDate.getDayOfWeek();
        return dayOfWeek == DayOfWeek.SUNDAY || dayOfWeek == DayOfWeek.SATURDAY;
    }

}
