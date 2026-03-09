package kr.co.wise.office.domain.proposalattendant.entity;

import jakarta.persistence.*;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.minutesattendant.entity.MinutesAttendantEntity;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 제안서 기반 편성 인원 테이블
 * 제안서에 정의된 참여 인력이 저장됨
 */
@Entity
@Getter
@Builder
@Table(name = "proposal_attendant")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ProposalAttendantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proposal_attendant_pk")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "company_member_pk",
            foreignKey = @ForeignKey(name = "fk_proposal_attendant_company_member")
    )
    private CompanyMemberEntity companyMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "project_pk",
            foreignKey = @ForeignKey(name = "fk_proposal_attendant_project")
    )
    private ProjectEntity project;

    // 참여 일자
    @Column(name = "attend_date")
    private LocalDate attendDate;

    // (soft delete) 참여 종료 일자
    @Column(name = "exit_date")
    private LocalDate exitDate;

    @OneToMany(mappedBy = "proposalAttendantEntity")
    @Builder.Default
    private List<MinutesAttendantEntity> minutesAttendantEntities = new ArrayList<>();

    public void leaveProject(){
        this.exitDate = LocalDate.now();
    }

}
