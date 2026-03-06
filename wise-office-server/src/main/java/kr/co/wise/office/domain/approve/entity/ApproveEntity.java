package kr.co.wise.office.domain.approve.entity;

import jakarta.persistence.*;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import kr.co.wise.office.util.DateUtil;
import lombok.*;

import java.time.LocalDate;

/**
 * 품의서 테이블
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
    @Column(name = "minutes_department")
    private String minutesDepartment;

    @Builder
    private ApproveEntity(MinutesEntity minutesEntity, String reportNo, LocalDate writeDate, LocalDate submitDate, String minutesDepartment) {
        this.minutesEntity = minutesEntity;
        this.reportNo = reportNo;
        this.writeDate = writeDate;
        this.submitDate = submitDate;
        this.minutesDepartment = minutesDepartment;
    }

    public static ApproveEntity of(MinutesEntity minutes, LocalDate submitDate) {
        String reportNo = createReportNumber(minutes.getId(), submitDate);
        return ApproveEntity.builder()
                .submitDate(submitDate)
                .writeDate(submitDate)
                .minutesDepartment("연구기획")
                .minutesEntity(minutes)
                .reportNo(reportNo)
                .build();
    }

    /**
     * 품의서 번호 만드는 메소드
     */
    private static String createReportNumber(long id, LocalDate submitDate) {
        final String prefix = "WISEBM";
        String formattedDate = submitDate.format(DateUtil.titleFormatter);
        String formattedNumber = String.format("%02d", id);
        return prefix + formattedDate + formattedNumber;
    }

}
