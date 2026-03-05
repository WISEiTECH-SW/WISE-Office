package kr.co.wise.office.domain.companymember.repository;

import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyMemberEntityRepository extends JpaRepository<CompanyMemberEntity, Long> {
}
