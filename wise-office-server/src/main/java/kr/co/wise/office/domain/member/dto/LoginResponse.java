package kr.co.wise.office.domain.member.dto;

import java.time.LocalDateTime;

public record LoginResponse(LocalDateTime expiredAt) {
}
