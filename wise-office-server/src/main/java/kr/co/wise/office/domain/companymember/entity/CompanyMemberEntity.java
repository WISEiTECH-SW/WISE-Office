package kr.co.wise.office.domain.companymember.entity;

import jakarta.persistence.*;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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

    // 이메일 prefix
    @Column(name = "email_prefix")
    private String emailPrefix;

    // 퇴사 처리 시간 => NULL이 아닌 경우 퇴사자
    @Column(name = "left_at")
    private LocalDateTime leftAt;

    @OneToMany(mappedBy = "companyMember")
    @Builder.Default
    private List<ProposalAttendantEntity> proposalAttendantEntities = new ArrayList<>();

    public void leaveCompany(){
        this.leftAt = LocalDateTime.now();
    }

    public void updateInfo(String name, String team, String rank) {
        this.name = name;
        this.team = team;
        this.rank = rank;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CompanyMemberEntity that = (CompanyMemberEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

