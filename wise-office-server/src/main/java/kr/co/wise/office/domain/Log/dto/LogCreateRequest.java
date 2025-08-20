package kr.co.wise.office.domain.Log.dto;

import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;

public record LogCreateRequest(String title, String content) {


    public LogEntity toEntity(MemberEntity member, ProjectEntity project) {
        return LogEntity
                .builder()
                .logDetail(this.content)
                .title(this.title)
                .member(member)
                .project(project)
                .build();
    }

}
