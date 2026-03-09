package kr.co.wise.office.domain.minutesattendant.service;

import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.companymember.repository.CompanyMemberEntityRepository;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.minutesattendant.entity.MinutesAttendantEntity;
import kr.co.wise.office.domain.minutesattendant.repository.MinutesAttendantEntityRepository;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.repository.ProposalAttendantEntityRepository;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MinutesAttendantsService {

    private final MinutesAttendantEntityRepository attendantEntityRepository;
    private final CompanyMemberEntityRepository companyMemberEntityRepository;
    private final ProposalAttendantEntityRepository proposalAttendantEntityRepository;

    // TODO : 동명이인 처리 필요 => 클라이언트에서는 뒤의 알파벳 빼고 보여주기?
    public void createMinutesAttendants(List<String> attendantNames, long projectId, MinutesEntity minutes) {
        // 사원명 조회
        List<CompanyMemberEntity> companyMembers = companyMemberEntityRepository.findByNameIn(attendantNames);

        // 제안서상 참여자 리스트 조회
        List<ProposalAttendantEntity> proposalAttendants = proposalAttendantEntityRepository.findByCompanyMemberInAndId(companyMembers, projectId);

        // 제안서상 참여하지 않은 사람을 회의에 등록하는 경우 에러 처리
        if (companyMembers.size() != proposalAttendants.size()) {
            throw new ApplicationRuntimeException(ErrorMessage.REJECT_CREATE_MINUTES);
        }

        // 저장
        List<MinutesAttendantEntity> minutesAttendants = proposalAttendants.stream()
                .map(attendant -> new MinutesAttendantEntity(attendant, minutes))
                .collect(Collectors.toList());
        attendantEntityRepository.saveAll(minutesAttendants);
    }

    public List<MinutesAttendantEntity> findByProposalAndMinutesDate(List<ProposalAttendantEntity> attendants,
                                                                     LocalDate minutesDate) {
        return attendantEntityRepository.findByProposalAndMinutesDate(attendants, minutesDate);
    }

}
