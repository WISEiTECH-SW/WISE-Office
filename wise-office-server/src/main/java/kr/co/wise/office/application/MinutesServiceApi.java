package kr.co.wise.office.application;

import kr.co.wise.office.aop.CheckProjectAuth;
import kr.co.wise.office.api.dto.minutes.*;
import kr.co.wise.office.domain.Project.Service.ProjectService;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.approve.service.ApproveService;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.service.MinutesService;
import kr.co.wise.office.domain.minutesattendant.service.MinutesAttendantsService;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.service.ProposalAttendantsService;
import kr.co.wise.office.external.hoilday.dto.HolidayCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MinutesServiceApi {


    private final ProjectService projectService;
    private final MinutesService minutesService;
    private final MinutesAttendantsService minutesAttendantsService ;
    private final ApproveService approveService;

    private final HolidayCalculator holidayCalculator;

    private final ProposalAttendantsService proposalAttendantsService;

    public List<MinutesListResponse> getMinutesBriefInfo(
            long projectId,
            String loginUserEmail
    ) {
        return minutesService.getMinutesBriefInfo(projectId);
    }
    public Page<MinutesListResponse> getMinutesBriefInfo(
            long projectId,
            String loginUserEmail,
            Pageable pageable
    ) {
        return minutesService.getMinutesBriefInfo(projectId, pageable);
    }

    @CheckProjectAuth
    @Transactional
    public MinutesDetailResponse createMinutes(long projectId, String loginUserEmail, MinutesCreateRequest request) {
        // 회의록 작성 번호 확인 => 마지막 회의 번호 + 1
        ProjectEntity project = projectService.findById(projectId);
        long currentMinutesNumber = minutesService.countByMinutesDate(request.minutesDate(), projectId) + 1;
        ProposalAttendantEntity writerInfo = proposalAttendantsService.findWriterInfo(request.writer(), projectId);

        MinutesEntity minutes = minutesService.createMinutes(project, request, currentMinutesNumber);

        // 회의 참석자 등록
        List<Long> proposalAttendantsIds = removeDuplicateWriter(request.minutesAttendants(), writerInfo);
        List<MinutesAttendantsInfo> minutesAttendantNames = minutesAttendantsService.createMinutesAttendants(proposalAttendantsIds, projectId, minutes);

        return MinutesDetailResponse.from(minutes, minutesAttendantNames, null, MinutesAttendantsInfo.of(writerInfo, writerInfo.getCompanyMember()));
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
        long updateCurrentMinutesNumber = minutesService.countByMinutesDate(request.minutesDate(), projectId) + 1;
        ProposalAttendantEntity writerInfo = proposalAttendantsService.findWriterInfo(request.writer(), projectId);
        minutes.update(request, updateCurrentMinutesNumber);

        // 작성자의 참석자 중복 방지를 위해 set으로 정제 (list와 writerId가 둘 다 존재하는 경우)
        List<Long> proposalAttendantIds = removeDuplicateWriter(request.minutesAttendants(), writerInfo);
        List<MinutesAttendantsInfo> minutesAttendantsInfos = minutesAttendantsService.updateMinutesAttendants(minutes, proposalAttendantIds, projectId);

        // 품의서 수정
        Optional<ApproveEntity> approveEntity = approveService.findByMinutesIdAndProjectId(minutesId, projectId);
        if (approveEntity.isEmpty()) {
            return MinutesDetailResponse.from(minutes, minutesAttendantsInfos, null, MinutesAttendantsInfo.of(writerInfo, writerInfo.getCompanyMember()));
        }

        ApproveEntity approve = approveEntity.get();
        LocalDate changeApproveWrittenDate = holidayCalculator.calculateSubmitDate(request.minutesDate());
        approve.updateApprove(minutes, changeApproveWrittenDate, writerInfo);

        return MinutesDetailResponse.from(minutes, minutesAttendantsInfos, approve.getId(), MinutesAttendantsInfo.of(writerInfo, writerInfo.getCompanyMember()));
    }

    @CheckProjectAuth
    @Transactional
    public void removeMinutesWithApprove(long projectId, String loginUserEmail, long minutesId) {
        //품의서 삭제
        approveService.deleteApprove(projectId, minutesId);
        //회의 참여 인원 삭제
        minutesAttendantsService.deleteAttendants(minutesId);
        //회의록 삭제
        minutesService.deleteMinutes(projectId, minutesId);
    }

    private static List<Long> removeDuplicateWriter(List<Long> proposalAttendantIds, ProposalAttendantEntity writerInfo) {
        Set<Long> proposalAttendantsIdsSet = new HashSet<>(proposalAttendantIds);
        proposalAttendantsIdsSet.add(writerInfo.getId());
        return new ArrayList<>(proposalAttendantsIdsSet);
    }

}
