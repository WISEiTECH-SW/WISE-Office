package kr.co.wise.office.domain.attendant.entity;

import jakarta.persistence.*;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import lombok.*;

import java.time.LocalDate;

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
    @JoinColumn(
            name = "fk_member_attendant",
            foreignKey = @ForeignKey(name = "fk_attendant_member")
    )
    private MemberEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "fk_project_attendant",
            foreignKey = @ForeignKey(name = "fk_attendant_project")
    )
    private ProjectEntity project;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private AttendantRoleType role;

    @Column(name = "left_at")
    private LocalDate leftAt;

    public void leaveProject() {
        this.leftAt = LocalDate.now();
    }

    public void changeRole(AttendantRoleType attendantRoleType) {
        this.role = attendantRoleType;
    }

    public boolean hasRole(AttendantRoleType role) {
        return this.role == role;
    }
}
