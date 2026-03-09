package kr.co.wise.office.domain.companymember.repository;

import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CompanyMemberEntityRepository extends JpaRepository<CompanyMemberEntity, Long> {


    List<CompanyMemberEntity> findByNameIn(List<String> names);


    @Query("select m from CompanyMemberEntity m where m.id in :ids")
    Optional<List<CompanyMemberEntity>> findByIds(@Param("ids")List<Long> ids);
}
