package kr.co.wise.office.domain.minutes.service;

import kr.co.wise.office.api.dto.minutes.MinutesAttendantsInfo;
import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.api.dto.minutes.MinutesDetailResponse;
import kr.co.wise.office.api.dto.minutes.MinutesListResponse;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.approve.repository.ApproveEntityRepository;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.repository.MinutesEntityRepository;
import kr.co.wise.office.domain.minutesattendant.repository.MinutesAttendantEntityRepository;
import kr.co.wise.office.domain.minutesattendant.repository.MinutesAttendantEntityRepository.MinutesAttendantsInfoProjection;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.service.ProposalAttendantsService;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MinutesService {

    private final MinutesEntityRepository minutesEntityRepository;

    private final MinutesAttendantEntityRepository minutesAttendantEntityRepository;

    private final ApproveEntityRepository approveEntityRepository;

    private final ProposalAttendantsService proposalAttendantsService;

    public Page<MinutesListResponse> getMinutesBriefInfo(
            long projectId,
            Pageable pageable
    ) {
        Page<MinutesEntity> minutesEntities = minutesEntityRepository.findByProjectIdOrderByIdDesc(projectId, pageable);
        List<Long> proposalAttendantId = minutesEntities.getContent().stream().map(a -> Long.parseLong(a.getWriter())).toList();
        List<ProposalAttendantEntity> writerInfos = proposalAttendantsService.findWriterInfos(proposalAttendantId, projectId);

        List<MinutesListResponse> result = new ArrayList<>();
        Map<Long, ProposalAttendantEntity> writerMap =
                writerInfos.stream()
                        .collect(Collectors.toMap(ProposalAttendantEntity::getId, w -> w));

        for (MinutesEntity minutesEntity : minutesEntities.getContent()) {
            Long writerId = Long.parseLong(minutesEntity.getWriter());
            ProposalAttendantEntity writerInfo = writerMap.get(writerId);

            if (writerInfo != null) {
                result.add(MinutesListResponse.from(
                        minutesEntity,
                        writerInfo.getCompanyMember()
                ));
            }
        }

        return new PageImpl<>(result, pageable, minutesEntities.getTotalElements());
    }

    @Transactional
    public MinutesEntity createMinutes(ProjectEntity project, MinutesCreateRequest request, long currentMinutesNumber) {
        MinutesEntity minutesEntity = MinutesEntity.from(request, project, currentMinutesNumber);
        return minutesEntityRepository.save(minutesEntity);
    }

    /**
     * 회의록 작성 일자에 작성된 회의록 개수를 반환
     */
    public long countByMinutesDate(LocalDate writeDate, long projectId) {
        return minutesEntityRepository.countByMinutesDate(writeDate, projectId);
    }

    public MinutesDetailResponse getMinutesDetailInfo(long minutesId, long projectId) {
        MinutesEntity minutesEntity = minutesEntityRepository.findByIdWithProject(minutesId, projectId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_MINUTES));

        ProposalAttendantEntity writerInfo = proposalAttendantsService.findWriterInfo(Long.parseLong(minutesEntity.getWriter()), projectId);

        Optional<ApproveEntity> approveEntity = approveEntityRepository.findByMinutesIdAndProjectId(minutesId, projectId);
        Long approveId = approveEntity.isPresent() ? approveEntity.get().getId() : null;

        List<MinutesAttendantsInfoProjection> attendantsInfoProjections = minutesAttendantEntityRepository.findMemberNamesByMinutesId(minutesId);
        List<MinutesAttendantsInfo> minutesAttendantsInfos = attendantsInfoProjections.stream()
                .map(MinutesAttendantsInfo::from).toList();

        return MinutesDetailResponse.from(minutesEntity, minutesAttendantsInfos, approveId, MinutesAttendantsInfo.of(writerInfo, writerInfo.getCompanyMember()));
    }

    public MinutesEntity getMinutesInfoWithProject(long minutesId, long projectId) {
        return minutesEntityRepository.findByIdWithProject(minutesId, projectId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_MINUTES));
    }

    public LocalDate findMinutesDateByMinutesId(long minutesId) {
        return minutesEntityRepository.findById(minutesId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_MINUTES))
                .getMinutesDate();
    }

    public void deleteMinutes(long projectId, long minutesId) {
        MinutesEntity minutesEntity = minutesEntityRepository.findByIdWithProject(minutesId, projectId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_MINUTES));

        minutesEntityRepository.delete(minutesEntity);
    }

}
