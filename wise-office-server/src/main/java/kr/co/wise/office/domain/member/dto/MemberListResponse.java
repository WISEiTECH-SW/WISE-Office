package kr.co.wise.office.domain.member.dto;

import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import lombok.Data;

@Data
public class MemberListResponse {

    private long memberId;
    private String rank;
    private String team;
    private String name;
    private String role;

    public static MemberListResponse loadMemberInfo(MemberEntity member) {
        MemberListResponse response = new MemberListResponse();
        response.setMemberId(member.getId());
        response.setName(member.getName());
        response.setRank(member.getRank());
        response.setTeam(member.getTeam());
        return response;
    }

    public static MemberListResponse convertCompanyMembertoMember(CompanyMemberEntity member){
        MemberListResponse response = new MemberListResponse();
        response.setMemberId(member.getId());
        response.setName(member.getName());
        response.setRank(member.getRank());
        response.setTeam(member.getTeam());
        return response;
    }


}
