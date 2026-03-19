package kr.co.wise.office.domain.minutesattendant.service;

import kr.co.wise.office.api.dto.minutes.MinutesAttendantsInfo;
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
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MinutesAttendantsService {

    private final MinutesAttendantEntityRepository attendantEntityRepository;

    private final CompanyMemberEntityRepository companyMemberEntityRepository;

    private final ProposalAttendantEntityRepository proposalAttendantEntityRepository;

    // TODO : 동명이인 처리 필요 => 클라이언트에서는 뒤의 알파벳 빼고 보여주기?
    // 리턴 값 : "이름 직급, 이름 직급" 형태로 반환
    public List<MinutesAttendantsInfo> createMinutesAttendants(List<Long> proposalAttendantsIds, long projectId, MinutesEntity minutes) {
        // 제안서상 참여자 리스트 조회
        List<ProposalAttendantEntity> proposalAttendants = proposalAttendantEntityRepository.findByProposalAttendantIdInAndProjectId(proposalAttendantsIds, projectId);

        if (proposalAttendants.size() != proposalAttendantsIds.size()) {
            throw new ApplicationRuntimeException(ErrorMessage.REJECT_CREATE_MINUTES);
        }

        // 저장
        List<MinutesAttendantEntity> minutesAttendants = proposalAttendants.stream()
                .map(attendant -> new MinutesAttendantEntity(attendant, minutes))
                .collect(Collectors.toList());
        attendantEntityRepository.saveAll(minutesAttendants);


        return proposalAttendants.stream()
                .map(p -> MinutesAttendantsInfo.of(p, p.getCompanyMember()))
                .toList();
    }

    public Set<Long> findOverlappingMembers(LocalDate minutesDate) {
        return attendantEntityRepository.findOverlappingMembers(minutesDate);
    }

    public List<MinutesAttendantsInfo> updateMinutesAttendants(MinutesEntity minutes, List<Long> proposalAttendantIds, long projectId) {
        // 업데이트할 참석 인원 명단 조회
        List<ProposalAttendantEntity> targetProposalAttendants = proposalAttendantEntityRepository.findByProposalAttendantIdInAndProjectId(proposalAttendantIds, projectId);

        if (proposalAttendantIds.size() != targetProposalAttendants.size()) {
            throw new ApplicationRuntimeException(ErrorMessage.REJECT_MODIFYING_MINUTES);
        }

        // 기존에 참석 중인 인원 명단 조회
        List<MinutesAttendantEntity> currentAttendants = attendantEntityRepository.findAttendantsByMinutesId(minutes.getId());
        Set<ProposalAttendantEntity> currentProposals = currentAttendants.stream().map(m -> m.getProposalAttendantEntity()).collect(Collectors.toSet());

        // 회의 참여에서 제외되는 인원 계산 : (현재 명단) - (새로운 명단)
        List<MinutesAttendantEntity> remove = currentAttendants
                .stream()
                .filter(attedant ->!targetProposalAttendants.contains(attedant.getProposalAttendantEntity()))
                .toList();

        // 추가 대상 계산 : (새로운 명단) - (현재 명단)
        List<MinutesAttendantEntity> add = targetProposalAttendants
                .stream()
                .filter(a -> !currentProposals.contains(a))
                .map(p -> new MinutesAttendantEntity(p, minutes))
                .toList();

        if(!remove.isEmpty()) attendantEntityRepository.deleteAll(remove);
        if(!add.isEmpty()) attendantEntityRepository.saveAll(add);

        return targetProposalAttendants.stream()
                .map(p -> MinutesAttendantsInfo.of(p, p.getCompanyMember()))
                .toList();
    }

    /**
     *  회의록 참석 인원을 파싱하는 메소드,
     *  writer와 minutesAttendants 중복 방지를 위해 distinct 사용
     */
    private List<String> splitAttendantsName(String minutesAttendants, String writer) {
        return Stream.concat(
                Arrays.stream(minutesAttendants.split(",")).map(String::trim),
                Stream.of(writer)
        ).distinct().toList();
    }

    public void deleteAttendants(long minutesId) {
        List<MinutesAttendantEntity> attendants = attendantEntityRepository.findAttendantsByMinutesId(minutesId);
        attendantEntityRepository.deleteAll(attendants);
    }
}
