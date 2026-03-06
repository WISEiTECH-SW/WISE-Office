package kr.co.wise.office.api.dto.proposal_attendant;

public record PossibleAttendantsResponse(
        String name,
        boolean canAttend
) {}
