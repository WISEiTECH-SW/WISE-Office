package kr.co.wise.office.domain.comment.entity;

import jakarta.persistence.*;
import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@Table(name = "comment")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class CommentEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_pk")
    private Long id;

    private String content;

    @CreatedDate
    @Column(name = "written_at", updatable = false)
    private LocalDateTime writtenAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_log_comment")
    private LogEntity log;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_member_comment")
    private MemberEntity member;

    public void updateContent(String content) {
        this.content = content;
    }


}
