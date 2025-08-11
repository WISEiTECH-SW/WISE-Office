package wise.backoffice.backoffice.domain.member.entity;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import wise.backoffice.backoffice.domain.Log.entity.LogEntity;
import wise.backoffice.backoffice.domain.attendant.entity.AttendantEntity;
import wise.backoffice.backoffice.domain.comment.entity.CommentEntity;

@Entity
@Getter
@Builder
@Table(name = "member")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MemberEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_pk")
    private Long id;

    @Column(name = "team")
    private String team;

    @Column(name = "rank")
    private String rank;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "authority")
    private MemberRoleType roleType;


    @OneToMany(mappedBy = "member")
    @Builder.Default
    private List<AttendantEntity> attendants = new ArrayList<>();


    @OneToMany(mappedBy = "member")
    @Builder.Default
    private List<LogEntity> logs = new ArrayList<>();


    @OneToMany(mappedBy = "member")
    @Builder.Default
    private List<CommentEntity> comments = new ArrayList<>();

}