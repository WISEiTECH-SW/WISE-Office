package kr.co.wise.office.domain.minutesattendant.entity;

import jakarta.persistence.*;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import lombok.*;

/**
 * 회의 참석자 테이블
 */
@Entity
@Getter
@Builder
@Table(name = "minutes_attendants")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MinutesAttendantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "minutes_attendant_pk")
    private Long id;

    // 참여 인원 번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "proposal_attendant_pk",
            foreignKey = @ForeignKey(name = "fk_minutes_attendants_proposal_attendant")
    )
    private ProposalAttendantEntity proposalAttendantEntity;

    // 참여 회의 번호
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "minutes_pk",
            foreignKey = @ForeignKey(name = "fk_minutes_attendants_minutes")
    )
    private MinutesEntity minutesEntity;

    public MinutesAttendantEntity(ProposalAttendantEntity proposalAttendantEntity, MinutesEntity minutesEntity) {
        this.proposalAttendantEntity = proposalAttendantEntity;
        this.minutesEntity = minutesEntity;
    }

}
