package kr.co.wise.office.domain.Project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;

public record ProjectProposalAttendantList(
         long memberId,
         String rank,
         String team,
         String name,
         @Schema(description = "참석인원 상의서의 역할, PM인 경우 \"PM\" 으로 표시, 일반 참석자는 NORMAL") String role
) {
    public static ProjectProposalAttendantList of(CompanyMemberEntity member, String role){
         return new ProjectProposalAttendantList(
                member.getId(),
                member.getRank(),
                member.getTeam(),
                member.getName(),
                role
        );
    }
}
