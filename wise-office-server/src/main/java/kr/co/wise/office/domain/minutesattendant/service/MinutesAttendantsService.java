package kr.co.wise.office.domain.minutesattendant.service;

import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
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
import java.util.Arrays;
import java.util.HashSet;
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
    public void createMinutesAttendants(MinutesCreateRequest request, long projectId, MinutesEntity minutes) {
        List<String> attendantNames = splitAttendantsName(request.minutesAttendants(), request.writer());

        // 사원명 조회
        List<CompanyMemberEntity> companyMembers = companyMemberEntityRepository.findByNameIn(attendantNames);

        // 제안서상 참여자 리스트 조회
        List<ProposalAttendantEntity> proposalAttendants = proposalAttendantEntityRepository.findByCompanyMemberInAndProjectId(companyMembers, projectId);

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

    public void updateMinutesAttendants(MinutesEntity minutes, String minutesAttendants, String writer, long projectId) {
        // 업데이트할 참석 인원 명단 조회
        Set<CompanyMemberEntity> updateMemberEntities = new HashSet<>(companyMemberEntityRepository.findByNameIn(splitAttendantsName(minutesAttendants, writer)));
        List<ProposalAttendantEntity> proposalAttendants = proposalAttendantEntityRepository.findByCompanyMemberInAndProjectId(updateMemberEntities, projectId);

        // 수정할 인원이 현재 제안서에 포함되어있는지 확인
        if (updateMemberEntities.size() != proposalAttendants.size()) {
            throw new ApplicationRuntimeException(ErrorMessage.REJECT_CREATE_MINUTES);
        }

        // 현재 참석 중인 인원 명단
        List<MinutesAttendantEntity> nowAttendants = attendantEntityRepository.findAttendantsByMinutesId(minutes.getId());
        Set<CompanyMemberEntity> nowAttendantsName = nowAttendants.stream().map(m -> m.getProposalAttendantEntity().getCompanyMember())
                .collect(Collectors.toSet());

        // 회의 참여에서 제외되는 인원 계산
        Set<CompanyMemberEntity> removeAttendantsSet = new HashSet<>(nowAttendantsName);
        removeAttendantsSet.removeAll(updateMemberEntities);
        Set<MinutesAttendantEntity> remove = nowAttendants.stream()
                .filter(n -> removeAttendantsSet.contains(n.getProposalAttendantEntity().getCompanyMember()))
                .collect(Collectors.toSet());

        // 회의 참여에 추가되는 인원 계산
        Set<CompanyMemberEntity> addMembers = new HashSet<>(updateMemberEntities);
        addMembers.removeAll(nowAttendantsName);
        List<ProposalAttendantEntity> newAttendants = proposalAttendantEntityRepository.findByCompanyMemberInAndProjectId(addMembers, projectId);
        List<MinutesAttendantEntity> add = newAttendants.stream().map(a -> new MinutesAttendantEntity(a, minutes)).toList();

        if(!remove.isEmpty()) attendantEntityRepository.deleteAll(remove);
        if(!add.isEmpty()) attendantEntityRepository.saveAll(add);
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
