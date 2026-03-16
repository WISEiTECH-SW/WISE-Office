package kr.co.wise.office.domain.approve.entity;

import jakarta.persistence.*;
import kr.co.wise.office.api.dto.approve.ApproveUpdateRequest;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
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

    // 품의 부서
    @Column(name = "minutes_department")
    private String minutesDepartment;

    // 품의자
    @Column(name = "writer")
    private String writer;

    @Builder
    private ApproveEntity(MinutesEntity minutesEntity, String reportNo, LocalDate writeDate, LocalDate submitDate, String minutesDepartment) {
        this.minutesEntity = minutesEntity;
        this.reportNo = reportNo;
        this.writeDate = writeDate;
        this.submitDate = submitDate;
        this.minutesDepartment = minutesDepartment;
    }

    public static ApproveEntity from(MinutesEntity minutesEntity, LocalDate submitDate) {
        String reportNo = createApproveNumber(minutesEntity, submitDate);
        return ApproveEntity.builder()
                .reportNo(reportNo)
                .submitDate(submitDate)
                .writeDate(submitDate)
                .minutesDepartment("연구기획")
                .minutesEntity(minutesEntity)
                .writer(minutesEntity.getWriter())
                .build();
    }

    private static String createApproveNumber(MinutesEntity minutesEntity, LocalDate submitDate) {
        int number = Integer.parseInt(minutesEntity.getTitle().substring(minutesEntity.getTitle().length() - 1));
        String reportNo = String.format("WISEBM%d-%02d%02d%02d", submitDate.getYear(), submitDate.getMonthValue(), submitDate.getDayOfMonth(), number);
        return reportNo;
    }

    public void updateApprove(ApproveUpdateRequest request) {
        this.reportNo = request.reportNo();
        this.writer = request.writer();
    }

    public void updateApprove(MinutesEntity minutes, LocalDate submitAt) {
        this.writeDate = submitAt;
        this.submitDate = submitAt;
        this.writer = minutes.getWriter();
    }

}
