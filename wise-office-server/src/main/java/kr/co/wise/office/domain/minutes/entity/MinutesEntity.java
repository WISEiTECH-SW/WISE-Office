package kr.co.wise.office.domain.minutes.entity;

import jakarta.persistence.*;
import kr.co.wise.office.api.dto.minutes.MinutesCreateRequest;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.minutesattendant.entity.MinutesAttendantEntity;
import kr.co.wise.office.util.DateUtil;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 *  회의록 테이블
 */
@Entity
@Getter
@Builder
@Table(name = "minutes")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MinutesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "minutes_pk")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "project_pk",
            foreignKey = @ForeignKey(name = "fk_minutes_project")
    )
    private ProjectEntity project;

    //회의록 제목
    @Column(name = "title")
    private String title;

    //회의 주관 기관
    @Column(name = "host")
    private String host;

    //회의 년/월/일
    @Column(name = "minutes_date")
    private LocalDate minutesDate;

    //회의 장소
    @Column(name = "location")
    private String location;

    //회의 목적
    @Column(name = "purpose")
    private String purpose;

    //작성자
    @Column(name = "writer")
    private String writer;

    //회의 내용
    @Lob
    @Column(name = "meeting_content", columnDefinition = "TEXT")
    private String meetingContent;

    //타기관 참여자
    @Column(name = "inst_attendants")
    private String instAttendants;

    //시작 시간
    @Column(name = "start_time")
    private LocalTime startTime;

    //종료 시간
    @Column(name = "end_time")
    private LocalTime endTime;

    //회의록 번호 (ex WISEMM-YYYY-mmddHH)
    @Column(name = "minutes_number")
    private String minutesNumber;

    @OneToMany(mappedBy = "minutesEntity")
    @Builder.Default
    private List<MinutesAttendantEntity> minutesAttendantEntities = new ArrayList<>();

    @OneToMany(mappedBy = "minutesEntity")
    @Builder.Default
    private List<ApproveEntity> approveEntities = new ArrayList<>();

    @Builder
    private MinutesEntity(String title, String host, LocalDate minutesDate, String location, String purpose, String writer,
                         String meetingContent, String instAttendants, LocalTime startTime, LocalTime endTime,
                         String minutesNumber) {
        this.title = title;
        this.host = host;
        this.minutesDate = minutesDate;
        this.location = location;
        this.purpose = purpose;
        this.writer = writer;
        this.meetingContent = meetingContent;
        this.instAttendants = instAttendants;
        this.startTime = startTime;
        this.endTime = endTime;
        this.minutesNumber = minutesNumber;
    }


    public static MinutesEntity from(MinutesCreateRequest request, ProjectEntity project, long currentMinutesNumber) {
        return MinutesEntity
                .builder()
                .title(createMinutesNumber(currentMinutesNumber, request.minutesDate()))
                .host(request.host())
                .minutesDate(request.minutesDate())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .location(request.location())
                .purpose(request.purpose())
                .instAttendants(request.instAttendants())
                .writer(request.writer())
                .meetingContent(request.content())
                .project(project)
                .build();
    }


    /**
     * 회의록 번호 만드는 메소드
     */
    private static String createMinutesNumber(long id, LocalDate minutesDate) {
        final String prefix = "WISEMM";
        String formattedDate = minutesDate.format(DateUtil.titleFormatter);
        String formattedNumber = String.format("%02d", id);
        return prefix + formattedDate + formattedNumber;
    }

}
