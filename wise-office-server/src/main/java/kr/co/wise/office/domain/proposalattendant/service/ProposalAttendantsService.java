package kr.co.wise.office.domain.proposalattendant.service;

import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.repository.ProposalAttendantEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProposalAttendantsService {

    private final ProposalAttendantEntityRepository proposalAttendantEntityRepository;

    public List<ProposalAttendantEntity> findById(long projectId) {
        //제안서상 편성 인원 조회
        return proposalAttendantEntityRepository.findByProjectIdWithCompanyName(projectId);
    }
}
