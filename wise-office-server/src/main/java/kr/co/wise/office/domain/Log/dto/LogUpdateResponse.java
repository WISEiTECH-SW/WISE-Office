package kr.co.wise.office.domain.Log.dto;

import jakarta.validation.constraints.NotBlank;

public record LogUpdateResponse(
        @NotBlank(message = "로그의 제목은 빈칸일 수 없습니다.") String title,
        @NotBlank(message = "로그의 내용은 빈칸일 수 없습니다.") String content) {

}
