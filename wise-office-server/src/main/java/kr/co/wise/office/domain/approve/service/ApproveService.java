package kr.co.wise.office.domain.approve.service;

import kr.co.wise.office.api.dto.approve.ApproveCreateResponse;
import kr.co.wise.office.api.dto.approve.ApproveUpdateRequest;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.approve.repository.ApproveEntityRepository;
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
public class ApproveService {

    private final ApproveEntityRepository approveEntityRepository;

    private final MinutesEntityRepository minutesEntityRepository;

    @Transactional
    public ApproveCreateResponse createApprove(long minutesId, long projectId, LocalDate submitDate) {
        MinutesEntity minutes = minutesEntityRepository.findByIdWithProject(minutesId, projectId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_MINUTES));
        ApproveEntity approve = approveEntityRepository.save(ApproveEntity.from(minutes, submitDate));
        return ApproveCreateResponse.of(minutes, approve);
    }

    @Transactional
    public ApproveEntity updateApprove(long projectId, ApproveUpdateRequest request, long approveId) {
        ApproveEntity approveEntity = approveEntityRepository.findByApproveIdAndProjectId(approveId, projectId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_APPROVE));

        approveEntity.updateApprove(request);
        return approveEntity;
    }

    public List<ApproveEntity> getApprovesByProjectId(long projectId) {
        return approveEntityRepository.findByProjectId(projectId);
    }

    public ApproveEntity getApproveWithMinutes(long approveId) {
        return approveEntityRepository.findByApproveIdWithMinutes(approveId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_APPROVE));
    }
}
