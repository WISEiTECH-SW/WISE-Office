package kr.co.wise.office.api.dto.minutes;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.minutesattendant.repository.MinutesAttendantEntityRepository.MinutesAttendantsInfoProjection;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;

public record MinutesAttendantsInfo(
        @Schema(description = "회의 참석 가능 여부 리스트에서의 memberId와 동일한 값 ") Long memberId, //proposalAttendantEntity 객체 Id pk 값
        @Schema(description = "이름") String name,
        @Schema(description = "직급") String rank
) {

    public static MinutesAttendantsInfo of(ProposalAttendantEntity proposalAttendantEntity,
                                             CompanyMemberEntity companyMember) {
        return new MinutesAttendantsInfo(proposalAttendantEntity.getId(), companyMember.getName(), companyMember.getRank());
    }

    public static MinutesAttendantsInfo from(MinutesAttendantsInfoProjection projection) {
        return new MinutesAttendantsInfo(projection.getMemberId(), projection.getName(), projection.getRank());
    }

}
