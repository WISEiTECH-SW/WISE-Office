package kr.co.wise.office.domain.Project.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;

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
