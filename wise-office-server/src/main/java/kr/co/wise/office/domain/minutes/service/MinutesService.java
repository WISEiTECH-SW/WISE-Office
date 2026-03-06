package kr.co.wise.office.domain.minutes.service;

import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.api.dto.minutes.MinutesDetailResponse;
import kr.co.wise.office.api.dto.minutes.MinutesListResponse;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.repository.MinutesEntityRepository;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MinutesService {

    private final MinutesEntityRepository minutesEntityRepository;

    public List<MinutesListResponse> getMinutesBriefInfo(
            long projectId
    ) {
        List<MinutesEntity> minutesEntities = minutesEntityRepository.findByProjectId(projectId);
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
    public long getlastMinutesNumber(LocalDate writeDate) {
        return minutesEntityRepository.countByMinutesDate(writeDate);
    }

    public MinutesDetailResponse getMinutesDetailInfo(long projectId, long minutesId) {
        MinutesEntity minutesEntity = minutesEntityRepository.findById(minutesId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_MINUTES));
        return MinutesDetailResponse.of(minutesEntity);
    }
}
