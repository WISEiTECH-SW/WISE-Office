package kr.co.wise.domain.attendant.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import kr.co.wise.domain.Project.entity.ProjectEntity;
import kr.co.wise.domain.member.entity.MemberEntity;

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

}
