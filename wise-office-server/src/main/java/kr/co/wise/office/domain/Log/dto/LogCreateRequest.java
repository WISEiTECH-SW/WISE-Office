package kr.co.wise.office.domain.Log.dto;

import kr.co.wise.office.api.validation.annotation.SubjectNotBlank;
import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;

public record LogCreateRequest(
        @SubjectNotBlank(subject = "로그 제목") String title,
        @SubjectNotBlank(subject = "로그 내용") String content) {

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
