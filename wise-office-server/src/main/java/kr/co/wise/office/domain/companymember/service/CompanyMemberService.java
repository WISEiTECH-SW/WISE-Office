package kr.co.wise.office.domain.companymember.service;

import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.companymember.repository.CompanyMemberEntityRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
@Service
@Slf4j
@AllArgsConstructor
public class CompanyMemberService {

    private final CompanyMemberEntityRepository companyMemberEntityRepository;

    @Transactional(readOnly = true)
    public List<CompanyMemberEntity> findByIds(List<Long> attendants) {
        return companyMemberEntityRepository.findByIds(attendants).orElse(new ArrayList<>());
    }
}
