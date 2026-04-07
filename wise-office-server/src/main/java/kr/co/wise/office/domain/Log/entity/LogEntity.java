package kr.co.wise.office.domain.Log.entity;

import jakarta.persistence.*;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.comment.entity.CommentEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@Table(name = "log")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class LogEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_pk")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "log_detail", length = 500)
    private String logDetail;

    @CreatedDate
    @Column(name = "written_at", updatable = false)
    private LocalDateTime writtenAt;

    @ManyToOne
    @JoinColumn(
            name = "fk_member_log",
            foreignKey = @ForeignKey(name = "fk_log_member")
    )
    private MemberEntity member;

    @ManyToOne
    @JoinColumn(
            name = "fk_project_log",
            foreignKey = @ForeignKey(name = "fk_log_project")
    )
    private ProjectEntity project;

    @OneToMany(mappedBy = "log")
    @BatchSize(size = 100)
    @Builder.Default
    private List<CommentEntity> comments = new ArrayList<>();

    @Column(name = "deleted")
    @Builder.Default
    private boolean deleted = false;

    public void update(String title, String logDetail) {
        this.title = title;
        this.logDetail = logDetail;
    }
}
