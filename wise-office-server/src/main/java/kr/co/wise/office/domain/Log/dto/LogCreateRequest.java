package kr.co.wise.office.domain.Log.dto;

import jakarta.validation.constraints.NotBlank;
import kr.co.wise.office.domain.Log.entity.LogEntity;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.member.entity.MemberEntity;

public record LogCreateRequest(
        @NotBlank(message = "로그의 제목은 빈칸일 수 없습니다.") String title,
        @NotBlank(message = "로그의 내용은 빈칸일 수 없습니다.") String content) {

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
