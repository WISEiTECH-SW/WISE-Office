package kr.co.wise.office.domain.member.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.comment.entity.CommentEntity;

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

    @Column(name = "provider_id")
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "authority")
    private MemberRoleType roleType;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "member")
    @Builder.Default
    private List<AttendantEntity> attendants = new ArrayList<>();


    @OneToMany(mappedBy = "member")
    @Builder.Default
    private List<LogEntity> logs = new ArrayList<>();


    @OneToMany(mappedBy = "member")
    @Builder.Default
    private List<CommentEntity> comments = new ArrayList<>();

    public void updateInfo(String username, String imageUrl) {
        this.name = username;
        this.imageUrl = imageUrl;
    }
}