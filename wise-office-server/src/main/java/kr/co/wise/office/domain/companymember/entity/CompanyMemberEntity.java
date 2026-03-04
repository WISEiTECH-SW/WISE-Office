package kr.co.wise.office.domain.companymember.entity;

import jakarta.persistence.*;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 사원 테이블
 * 사내 모든 인원 정보를 저장하는 테이블 => 편성 인원 관리를 위해 
 */
@Entity
@Getter
@Builder
@Table(name = "company_member")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class CompanyMemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_member_pk")
    private Long id;

    // 이름
    @Column(name = "name")
    private String name;

    // 부서
    @Column(name = "team")
    private String team;

    // 직급
    @Column(name = "rank")
    private String rank;

    @OneToMany(mappedBy = "companyMember")
    @Builder.Default
    private List<ProposalAttendantEntity> proposalAttendantEntities = new ArrayList<>();
}
