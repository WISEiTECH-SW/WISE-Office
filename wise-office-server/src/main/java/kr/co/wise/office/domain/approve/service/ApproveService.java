package kr.co.wise.office.domain.approve.service;

import kr.co.wise.office.api.dto.approve.ApproveCreateResponse;
import kr.co.wise.office.api.dto.approve.ApproveListResponse;
import kr.co.wise.office.api.dto.approve.ApproveUpdateRequest;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.approve.repository.ApproveEntityRepository;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutes.repository.MinutesEntityRepository;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.service.ProposalAttendantsService;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ApproveService {

    private final ApproveEntityRepository approveEntityRepository;

    private final MinutesEntityRepository minutesEntityRepository;

    private final ProposalAttendantsService proposalAttendantsService;

    @Transactional
    public ApproveCreateResponse createApprove(long minutesId, long projectId, LocalDate submitDate) {
        MinutesEntity minutes = minutesEntityRepository.findByIdWithProject(minutesId, projectId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_MINUTES));

        ProposalAttendantEntity writerInfo = proposalAttendantsService.findWriterInfo(Long.parseLong(minutes.getWriter()), projectId);

        ApproveEntity approve = approveEntityRepository.save(ApproveEntity.from(minutes, submitDate, writerInfo.getCompanyMember().getName()));
        return ApproveCreateResponse.of(minutes, approve, writerInfo.getCompanyMember().getName());
    }

    @Transactional
    public ApproveEntity updateApprove(long projectId, ApproveUpdateRequest request, long approveId) {
        ApproveEntity approveEntity = approveEntityRepository.findByApproveIdAndProjectId(approveId, projectId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_APPROVE));

        approveEntity.updateApprove(request);
        return approveEntity;
    }

    public Page<ApproveListResponse> getApprovesByProjectId(long projectId, Pageable pageable) {
        Page<ApproveEntity> approveEntities = approveEntityRepository.findByProjectId(projectId, pageable);
        List<ApproveListResponse> content = approveEntities.getContent().stream().map(ApproveListResponse::from).toList();

        return new PageImpl<>(content,pageable,approveEntities.getTotalElements());
    }

    public ApproveEntity getApproveWithMinutes(long approveId) {
        return approveEntityRepository.findByApproveIdWithMinutes(approveId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.NOT_FOUND_APPROVE));
    }

    public Optional<ApproveEntity> findByMinutesIdAndProjectId(long minutesId, long projectId) {
        return approveEntityRepository.findByMinutesIdAndProjectId(minutesId, projectId);
    }

    public void deleteApprove(long projectId, long minutesId) {
        Optional<ApproveEntity> approveEntity = approveEntityRepository.findByMinutesIdAndProjectId(minutesId, projectId);
        // 생성된 품의서가 없다면 삭제 미진행
        if (approveEntity.isEmpty()) {
            return;
        }
        ApproveEntity approve = approveEntity.get();
        approveEntityRepository.delete(approve);
    }
}
