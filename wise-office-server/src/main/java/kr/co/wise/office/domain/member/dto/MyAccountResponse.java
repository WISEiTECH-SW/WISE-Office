package kr.co.wise.office.domain.member.dto;

import java.util.List;
import kr.co.wise.office.domain.Project.dto.ProjectListResponse;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import lombok.Data;

@Data
public class MyAccountResponse {
    private long memberId;
    private String rank;
    private String team;
    private String name;
    private List<ProjectListResponse> projectList;

    public static MyAccountResponse loadMyAccountInfo(MemberEntity member, List<ProjectListResponse> projects) {
        MyAccountResponse response = new MyAccountResponse();
        response.setMemberId(member.getId());
        response.setRank(member.getRank());
        response.setTeam(member.getTeam());
        response.setName(member.getName());
        response.setProjectList(projects);
        return response;
    }

}