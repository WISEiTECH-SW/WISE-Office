package kr.co.wise.office.domain.Project.entity;

import jakarta.persistence.*;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@Table(name = "project")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_pk")
    private Long id;

    @Column(name = "title")
    private String title;
    
    @Column(name ="detail")
    private String detail;

    @Column(name = "start_year")
    private LocalDate startYear;

    @Column(name = "end_year")
    private LocalDate endYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_member_project")
    private MemberEntity member;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name ="fk_project_attendant")
    @Builder.Default
    private List<AttendantEntity> attendant = new ArrayList<>();

}
