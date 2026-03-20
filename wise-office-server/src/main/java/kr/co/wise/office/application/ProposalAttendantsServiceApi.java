package kr.co.wise.office.application;


import kr.co.wise.office.api.dto.proposal_attendant.PossibleAttendantsResponse;
import kr.co.wise.office.domain.Project.Service.ProjectService;
import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.service.AttendantService;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.service.MemberService;
import kr.co.wise.office.domain.minutesattendant.service.MinutesAttendantsService;
import kr.co.wise.office.domain.proposalattendant.entity.ProposalAttendantEntity;
import kr.co.wise.office.domain.proposalattendant.service.ProposalAttendantsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProposalAttendantsServiceApi {

    private final ProposalAttendantsService proposalAttendantsService;
    private final MinutesAttendantsService minutesAttendantsService;
    private final AttendantService attendantService;
    private final ProjectService projectService;
    private final MemberService memberService;

    /**
     * 특정 날짜에 회의를 참석 중인 인원은 같은 날짜에 다른 회의에 참여하지 못하도록 설정
     */
    @Transactional(readOnly = true)
    public List<PossibleAttendantsResponse> findPossibleAttendants(long projectId, LocalDate minutesDate, String loginUserEmail) {
        // 해당 프로젝트에 참여 중인지 검증
        MemberEntity loginUser = memberService.findByEmail(loginUserEmail);
        ProjectEntity project = projectService.findById(projectId);
        if (!loginUser.isAdmin()) {
            attendantService.validateParticipatingProject(loginUser, project);
        }

        // 현재 프로젝트에 참여 중인 편성 인원 리스트 조회
        List<ProposalAttendantEntity> proposalAttendants = proposalAttendantsService.findByProjectId(projectId);

        // 회의 생성 당일날 다른 회의에 참석 중인 리스트 조회
        Set<Long> busyAttendants = minutesAttendantsService.findOverlappingMembers(minutesDate);

        List<PossibleAttendantsResponse> statusList = proposalAttendants.stream().map(pa -> {
            boolean canAttend = !busyAttendants.contains(pa.getCompanyMember().getId());
            return new PossibleAttendantsResponse(pa.getId(),pa.getCompanyMember().getName(), pa.getCompanyMember().getRank(), canAttend);
        }).toList();

        return statusList;
    }
}
