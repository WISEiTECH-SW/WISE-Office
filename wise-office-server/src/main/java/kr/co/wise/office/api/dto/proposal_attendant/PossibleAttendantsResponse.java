package kr.co.wise.office.api.dto.proposal_attendant;

public record PossibleAttendantsResponse(
        long memberId,
        String name,
        boolean canAttend
) {}
