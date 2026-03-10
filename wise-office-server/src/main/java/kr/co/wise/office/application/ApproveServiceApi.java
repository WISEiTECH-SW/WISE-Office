package kr.co.wise.office.application;

import kr.co.wise.office.aop.CheckProjectAuth;
import kr.co.wise.office.api.dto.approve.*;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.approve.service.ApproveService;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.service.MinutesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApproveServiceApi {

    private final ApproveService approveService;

    private final MinutesService minutesService;

    /**
     * 해당 프로젝트에 작성된 품의서 목록 조회 메소드
     */
    @CheckProjectAuth
    @Transactional(readOnly = true)
    public List<ApproveListResponse> getApproveList(long projectId, String loginUserEmail) {
        List<ApproveEntity> approves = approveService.getApprovesByProjectId(projectId);
        return approves.stream().map(ApproveListResponse::from).toList();
    }

    /**
     * 품의서 생성 메소드
     * submitDate : 작성일자 및 접수일자
     */
    @CheckProjectAuth
    @Transactional
    public ApproveCreateResponse createApprove(long projectId, String loginUserEmail, long minutesId, LocalDate submitDate) {
        MinutesEntity minutesEntity = minutesService.getMinutesInfoWithProject(minutesId);
        ApproveEntity approve = approveService.createApprove(minutesEntity, submitDate);
        return ApproveCreateResponse.of(minutesEntity, approve);
    }

    /**
     * 품의서 상세 조회 메소드
     */
    @CheckProjectAuth
    @Transactional(readOnly = true)
    public ApproveDetailResponse getApproveDetail(long projectId, String loginUser, long approveId) {
        ApproveEntity approveWithMinutes = approveService.getApproveWithMinutes(approveId);
        return ApproveDetailResponse.from(approveWithMinutes.getMinutesEntity(), approveWithMinutes);
    }

    /**
     * 품의서 수정 메소드
     */
    @CheckProjectAuth
    @Transactional
    public ApproveUpdateResponse updateApprove(long projectId, String loginUserEmail, ApproveUpdateRequest request) {
        ApproveEntity approveEntity = approveService.updateApprove(request);
        return ApproveUpdateResponse.from(approveEntity);
    }

}
