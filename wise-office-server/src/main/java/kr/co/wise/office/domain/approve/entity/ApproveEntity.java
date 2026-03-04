package kr.co.wise.office.domain.approve.entity;

import jakarta.persistence.*;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import lombok.*;

import java.time.LocalDate;

/**
 *  품의서 테이블
 */
@Entity
@Getter
@Builder
@Table(name = "approve")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ApproveEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "approve_pk")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "minutes_pk",
            foreignKey = @ForeignKey(name = "fk_approve_minutes")
    )
    private MinutesEntity minutesEntity;

    // 품의서 번호
    @Column(name = "report_no")
    private String reportNo;

    // 작성 일자
    @Column(name = "write_date")
    private LocalDate writeDate;

    // 접수 일자
    @Column(name = "submit_date")
    private LocalDate submitDate;

    // 회의 목적
    @Column(name = "minutes_purpose")
    private String minutesPurpose;
}
