package kr.co.wise.office.domain.attendant.dto;

import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;

public record AttendantDetail(long memberId, String name, String imageUrl) {
    public static AttendantDetail of(MemberEntity attendant) {
        return new AttendantDetail(attendant.getId(), attendant.getName(), attendant.getImageUrl());
    }
    public static AttendantDetail of(CompanyMemberEntity attendant) {
        return new AttendantDetail(attendant.getId(), attendant.getName(), null);
    }
}
