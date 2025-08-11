package kr.co.wise.domain.Log.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
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
import kr.co.wise.domain.comment.entity.CommentEntity;
import kr.co.wise.domain.member.entity.MemberEntity;

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

    @Column(name = "log_detail")
    private String logDetail;

    @CreatedDate
    @Column(name = "written_at", updatable = false)
    private LocalDateTime writtenAt;

    @ManyToOne
    @JoinColumn(name = "fk_member_log")
    private MemberEntity member;

    @OneToMany(mappedBy = "log")
    @Builder.Default
    private List<CommentEntity> comments = new ArrayList<>();

}
