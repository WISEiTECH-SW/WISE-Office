package kr.co.wise.office.domain.Project.entity;

import jakarta.persistence.*;
import kr.co.wise.office.domain.Project.dto.ProjectUpdateRequest;
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
    
    @Column(name ="detail", length = 500)
    private String detail;

    @Column(name = "start_year")
    private LocalDate startYear;

    @Column(name = "end_year")
    private LocalDate endYear;

    @Column(name = "closed")
    @Builder.Default
    private boolean closed = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "fk_member_project",
            foreignKey = @ForeignKey(name = "fk_project_member")
    )
    private MemberEntity member;

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    @Builder.Default
    private List<AttendantEntity> attendant = new ArrayList<>();

    //전담 기관
    @Column(name = "institution")
    private String institution;

    //사업명
    @Column(name = "business_name")
    private String businessName;

    public void update(ProjectUpdateRequest request) {
        this.title = request.projectTitle();
        this.detail = request.content();
        this.startYear = request.start();
        this.endYear = request.end();
    }

    public void closeProject() {
        this.closed = true;
    }
}
