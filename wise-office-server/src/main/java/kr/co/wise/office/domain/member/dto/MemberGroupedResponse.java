package kr.co.wise.office.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MemberGroupedResponse {
    private List<MemberListResponse> members;
    private List<MemberListResponse> companyMembers;
}
