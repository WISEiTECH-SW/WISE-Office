package kr.co.wise.office.application;

import kr.co.wise.office.api.dto.overview.MonthlyApproveSummaryResponse;
import kr.co.wise.office.api.dto.overview.MonthlyDocumentGroupResponse;
import kr.co.wise.office.api.dto.overview.MonthlyDocumentPairResponse;
import kr.co.wise.office.api.dto.overview.MonthlyMinutesSummaryResponse;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.approve.repository.ApproveEntityRepository;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.repository.MinutesEntityRepository;
import kr.co.wise.office.domain.minutesattendant.repository.MinutesAttendantEntityRepository;
import kr.co.wise.office.domain.minutesattendant.repository.MinutesAttendantEntityRepository.MinutesAttendantNameProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OverviewServiceApi {

    private final MinutesEntityRepository minutesEntityRepository;
    private final ApproveEntityRepository approveEntityRepository;
    private final MinutesAttendantEntityRepository minutesAttendantEntityRepository;

    /**
     * 특정 월에 작성된 회의록 및 품의서 리스트 조회
     */
    public List<MonthlyDocumentGroupResponse> getMonthlyDocuments(Integer year, Integer month) {
        // 조회 기간 계산
        YearMonth yearMonth = YearMonth.now();

        if (year != null && month != null) {
            yearMonth = YearMonth.of(year, month);
        }

        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        // 회의록, 품의서 조회
        List<MinutesEntity> targetMinutes = minutesEntityRepository.findMonthlyOverviewTargets(start, end);
        if (targetMinutes.isEmpty()) {
            return List.of();
        }

        List<Long> minutesIds = targetMinutes.stream()
                .map(MinutesEntity::getId)
                .toList();

        Map<Long, String> attendantsByMinutesId = getAttendantsByMinutesId(minutesIds);
        Map<Long, ApproveEntity> approveByMinutesId = getApproveByMinutesId(minutesIds);

        // 과제명, 해당 과제에 기록된 회의록 및 품의서 목록 리스트
        Map<Long, String> projectInfo = new HashMap<>();
        Map<Long, List<MonthlyDocumentPairResponse>> result = new HashMap<>(); 
        for (MinutesEntity minutes : targetMinutes) {
            Long projectId = minutes.getProject().getId();
            projectInfo.put(projectId, minutes.getProject().getTitle());
            String attendantsName = attendantsByMinutesId.getOrDefault(minutes.getId(), "");
            MonthlyMinutesSummaryResponse minutesSummary = MonthlyMinutesSummaryResponse.from(minutes, attendantsName);

            ApproveEntity approve = approveByMinutesId.get(minutes.getId());
            MonthlyApproveSummaryResponse approveSummary = approve == null ? null : new MonthlyApproveSummaryResponse(approve.getReportNo(), approve.getId());

            result.computeIfAbsent(projectId, ignored -> new ArrayList<>())
                .add(new MonthlyDocumentPairResponse(minutesSummary, approveSummary));
        }

        return result.entrySet().stream()
                .map(entry -> new MonthlyDocumentGroupResponse(entry.getKey(), projectInfo.get(entry.getKey()), entry.getValue()))
                .toList();
    }

    /**
     * 해당 회의록의 참여자 이름을 (홍길동, 김민수, .. ) 형태로 반환하는 메소드
     * key : 회의록 번호
     * value : 해당 회의에 참여한 명단 리스트 문자열 (이름, 이름, 이름, 형태)
     */
    private Map<Long, String> getAttendantsByMinutesId(List<Long> minutesIds) {
        List<MinutesAttendantNameProjection> attendantNames = minutesAttendantEntityRepository.findAttendantNamesByMinutesIds(minutesIds);
        return attendantNames.stream()
                .collect(Collectors.groupingBy(
                        MinutesAttendantNameProjection::getMinutesId,
                        Collectors.mapping(MinutesAttendantNameProjection::getCompanyName, Collectors.joining(","))
                ));
    }

    /**
     * 회의록(minutes)에 대응되는 품의서 반환
     * key : 회의록 번호
     * value : 회의록에서 생성된 품의서
     */
    private Map<Long, ApproveEntity> getApproveByMinutesId(List<Long> minutesIds) {
        List<ApproveEntity> approves = approveEntityRepository.findByMinutesIds(minutesIds);
        Map<Long, ApproveEntity> result = new HashMap<>();
        for (ApproveEntity approve : approves) {
            result.put(approve.getMinutesEntity().getId(), approve);
        }

        return result;
    }
}
