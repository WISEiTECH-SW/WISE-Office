package kr.co.wise.office.domain.member.entity;

import jakarta.persistence.*;
import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.comment.entity.CommentEntity;
import kr.co.wise.office.domain.member.dto.MemberPositionUpdateRequest;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    public void updatePosition(MemberPositionUpdateRequest request) {
        this.rank = request.rank();
        this.team = request.team();
    }
}