package kr.co.wise.office.domain.companymember.repository;

import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CompanyMemberEntityRepository extends JpaRepository<CompanyMemberEntity, Long> {

    List<CompanyMemberEntity> findByLeftAtIsNull();

    @Query("select m from CompanyMemberEntity m where m.id in :ids and m.leftAt is null")
    Optional<List<CompanyMemberEntity>> findByIdsAndLeftAtIsNull(@Param("ids")List<Long> ids);
}
