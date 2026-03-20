package kr.co.wise.office.domain.proposalattendant.service;

import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.repository.ProposalAttendantEntityRepository;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.NotFoundResourceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProposalAttendantsService {

    private final ProposalAttendantEntityRepository proposalAttendantEntityRepository;

    public List<ProposalAttendantEntity> findByProjectId(long projectId) {
        //제안서상 편성 인원 조회
        return proposalAttendantEntityRepository.findByProjectIdWithCompanyName(projectId);
    }

    public ProposalAttendantEntity findWriterInfo(long writerProposalAttendantId, long projectId) {
        return proposalAttendantEntityRepository.findWriterInfo(writerProposalAttendantId, projectId)
                .orElseThrow(() -> new NotFoundResourceException(ErrorMessage.REJECT_CREATE_MINUTES));
    }

    public List<ProposalAttendantEntity> findWriterInfos(List<Long> proposalIds, long projectId) {
        List<ProposalAttendantEntity> writerInfos = proposalAttendantEntityRepository.findWriterInfos(proposalIds, projectId);
        if (writerInfos.isEmpty()) {
            throw new NotFoundResourceException(ErrorMessage.NOT_FOUND_ATTENDANT);
        }
        return writerInfos;
    }

}
