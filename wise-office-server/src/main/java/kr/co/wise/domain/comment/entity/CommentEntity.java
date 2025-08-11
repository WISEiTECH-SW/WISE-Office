package kr.co.wise.domain.comment.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import kr.co.wise.domain.Log.entity.LogEntity;
import kr.co.wise.domain.member.entity.MemberEntity;

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

}
