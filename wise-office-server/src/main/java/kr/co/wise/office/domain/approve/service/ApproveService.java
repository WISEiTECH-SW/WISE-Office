package kr.co.wise.office.domain.approve.service;

import kr.co.wise.office.api.dto.approve.ApproveUpdateRequest;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.approve.repository.ApproveEntityRepository;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
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

    @Transactional
    public ApproveEntity createApprove(MinutesEntity minutes, LocalDate submitDate) {
        ApproveEntity approve = ApproveEntity.from(minutes, submitDate);
        return approveEntityRepository.save(approve);
    }

    @Transactional
    public ApproveEntity updateApprove(ApproveUpdateRequest request) {
        ApproveEntity approveEntity = approveEntityRepository.findById(request.approveId())
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_APPROVE));

        approveEntity.updateApprove(request);
        return approveEntity;
    }

    public List<ApproveEntity> getApprovesByProjectId(long minutesId) {
        return approveEntityRepository.findByProjectId(minutesId);
    }

    public ApproveEntity getApproveWithMinutes(long approveId) {
        return approveEntityRepository.findByApproveIdWithMinutes(approveId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_APPROVE));
    }
}
