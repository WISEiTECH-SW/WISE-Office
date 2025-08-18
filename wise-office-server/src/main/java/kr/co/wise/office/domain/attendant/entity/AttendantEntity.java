package kr.co.wise.office.domain.attendant.entity;

import jakarta.persistence.*;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import lombok.*;

@Entity
@Getter
@Builder
@Table(name = "attendant")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AttendantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendant_pk")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_member_attendant")
    private MemberEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_project_attendant")
    private ProjectEntity project;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private AttendantRoleType role;

}
