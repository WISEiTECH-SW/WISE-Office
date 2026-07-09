package kr.co.wise.office.domain.companymember.service;

import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.companymember.repository.CompanyMemberEntityRepository;
import kr.co.wise.office.domain.proposalattendant.service.ProposalAttendantsService;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Slf4j
@AllArgsConstructor
public class CompanyMemberService {

    private final CompanyMemberEntityRepository companyMemberEntityRepository;

    private final ProposalAttendantsService proposalAttendantsService;

    @Transactional(readOnly = true)
    public List<CompanyMemberEntity> findByIds(List<Long> attendants) {
        return companyMemberEntityRepository.findByIds(attendants).orElse(new ArrayList<>());
    }

    @Transactional
    public void updateCompanyMemberInfo(MultipartFile list) {
        Map<String, CompanyMemberEntity> currentMemberMap = companyMemberEntityRepository.findAll().stream()
                .filter(c -> c.getEmailPrefix() != null)
                .collect(Collectors.toMap(m -> m.getEmailPrefix(), Function.identity()));
        List<CompanyMemberEntity> updateCompanyMember = parseRow(list);

        List<CompanyMemberEntity> newCompanyMembers = new ArrayList<>(); // 신규 입사자 리스트

        for (CompanyMemberEntity update : updateCompanyMember) {
            // 기존 입사자 업데이트
            if (currentMemberMap.containsKey(update.getEmailPrefix())) {
                CompanyMemberEntity currentMember = currentMemberMap.get(update.getEmailPrefix());
                currentMember.updateInfo(update.getTeam(), update.getRank());
                currentMemberMap.remove(update.getEmailPrefix());
            }
            else { // 신규 입사자 정보 저장
                newCompanyMembers.add(CompanyMemberEntity.builder()
                        .name(update.getName())
                        .rank(update.getRank())
                        .team(update.getTeam())
                        .emailPrefix(update.getEmailPrefix())
                        .build());
            }
        }

        // 퇴사자 리스트
        List<CompanyMemberEntity> removeCompanyMembers = new ArrayList<>(currentMemberMap.values());

        // 참여 과제 exit 처리
        proposalAttendantsService.exitAllProject(removeCompanyMembers);

        // 퇴사 처리
        removeCompanyMembers.forEach(CompanyMemberEntity::leaveCompany);

        // 신규 입사자 저장
        companyMemberEntityRepository.saveAllAndFlush(newCompanyMembers);
    }

    // Map<EmailPrefix, Entity> 형태로 전달
    private List<CompanyMemberEntity> parseRow(MultipartFile list) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(list.getInputStream()))) {
            List<CompanyMemberEntity> newCompanyMembers = reader.lines().map(line -> {
                String[] split = line.split("\t");
                if (split.length != 9) {
                    throw new ApplicationRuntimeException(ErrorMessage.REJECT_REQUEST);
                }
                String name = split[0];
                String team = split[1];
                String rank = split[2];
                String emailPrefix = split[8];
                return CompanyMemberEntity.builder().name(name).rank(rank).team(team).emailPrefix(emailPrefix).build();
            }).toList();
            return newCompanyMembers;
        } catch (IOException ex) {
            throw new ApplicationRuntimeException(ErrorMessage.REJECT_REQUEST);
        }
    }

}
