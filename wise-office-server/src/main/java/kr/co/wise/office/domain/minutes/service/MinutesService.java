package kr.co.wise.office.domain.minutes.service;

import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.api.dto.minutes.MinutesDetailResponse;
import kr.co.wise.office.api.dto.minutes.MinutesListResponse;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.approve.repository.ApproveEntityRepository;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.repository.MinutesEntityRepository;
import kr.co.wise.office.domain.minutesattendant.repository.MinutesAttendantEntityRepository;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MinutesService {

    private final MinutesEntityRepository minutesEntityRepository;

    private final MinutesAttendantEntityRepository minutesAttendantEntityRepository;

    private final ApproveEntityRepository approveEntityRepository;

    public List<MinutesListResponse> getMinutesBriefInfo(
            long projectId
    ) {
        List<MinutesEntity> minutesEntities = minutesEntityRepository.findByProjectIdOrderByIdDesc(projectId);
        return minutesEntities.stream().map(MinutesListResponse::of).toList();
    }

    @Transactional
    public MinutesEntity createMinutes(ProjectEntity project, MinutesCreateRequest request, long currentMinutesNumber) {
        MinutesEntity minutesEntity = MinutesEntity.from(request, project, currentMinutesNumber);
        return minutesEntityRepository.save(minutesEntity);
    }

    /**
     * 회의록 작성 일자에 작성된 회의록 개수를 반환
     */
    public long countByMinutesDate(LocalDate writeDate) {
        return minutesEntityRepository.countByMinutesDate(writeDate);
    }

    public MinutesDetailResponse getMinutesDetailInfo(long minutesId, long projectId) {
        MinutesEntity minutesEntity = minutesEntityRepository.findByIdWithProject(minutesId, projectId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_MINUTES));

        Optional<ApproveEntity> approveEntity = approveEntityRepository.findByMinutesIdAndProjectId(minutesId, projectId);
        Long approveId = approveEntity.isPresent() ? approveEntity.get().getId() : null;

        List<String> membersName = minutesAttendantEntityRepository.findMemberNamesByMinutesId(minutesId);

        return MinutesDetailResponse.from(minutesEntity, String.join(", ", membersName), approveId);
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
