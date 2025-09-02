package kr.co.wise.office.domain.member.dto;

public record SingUpRequest(String name, String password,
                            String team, String rank,
                            String email, String profileImage) {
}
