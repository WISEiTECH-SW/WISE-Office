package kr.co.wise.office.application;

import jakarta.persistence.EntityManager;
import kr.co.wise.office.domain.Project.dto.ProjectCreateRequest;
import kr.co.wise.office.domain.Project.dto.ProjectCreateResponse;
import kr.co.wise.office.domain.Project.repository.ProjectRepository;
import kr.co.wise.office.domain.attendant.repository.AttendantRepository;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import kr.co.wise.office.domain.member.entity.MemberRoleType;
import kr.co.wise.office.domain.member.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@SpringBootTest
@Transactional
public abstract class BaseTestEntity {

    @Autowired
    protected EntityManager em;
    @Autowired
    protected ProjectServiceApiV2 projectServiceApiV2;
    @Autowired
    protected MemberRepository memberRepository;
    @Autowired
    protected ProjectRepository projectRepository;
    @Autowired
    protected AttendantRepository attendantRepository;

    protected MemberCreationInfo pmInfo = new MemberCreationInfo("pm", "pm@test.co.kr");
    protected MemberCreationInfo adminInfo = new MemberCreationInfo("admin", "admin@test.co.kr");
    protected MemberCreationInfo creatorInfo = new MemberCreationInfo("creator", "creator@test.co.kr");
    protected MemberCreationInfo workerInfo1 = new MemberCreationInfo("worker1", "worker1@test.co.kr");
    protected MemberCreationInfo workerInfo2 = new MemberCreationInfo("worker2", "worker2@test.co.kr");
    protected static final LocalDate BASE_DATE = LocalDate.of(2025, 1, 1);

    protected Long projectId;
    protected MemberEntity pm;
    protected MemberEntity worker1;
    protected MemberEntity worker2;
    protected MemberEntity creator;
    protected MemberEntity admin;

    @BeforeEach
    void setUp() {
        this.pm = createMember(pmInfo.email, pmInfo.name, MemberRoleType.WORKER);
        this.worker1 = createMember(workerInfo1.email, workerInfo1.name, MemberRoleType.WORKER);
        this.worker2 = createMember(workerInfo2.email, workerInfo2.name, MemberRoleType.WORKER);
        this.creator = createMember(creatorInfo.email, creatorInfo.name, MemberRoleType.WORKER);
        this.admin = createMember(adminInfo.email, adminInfo.name, MemberRoleType.MASTER);

        ProjectCreateRequest request = new ProjectCreateRequest("title", BASE_DATE, BASE_DATE.plusDays(10),
                "content", pm.getId(), List.of(worker1.getId(), worker2.getId(), creator.getId()));
        ProjectCreateResponse response = projectServiceApiV2.createProjectV2(request, creator.getEmail());
        this.projectId = response.getProjectId();
    }

    protected MemberEntity createMember(String email, String name, MemberRoleType role) {
        return memberRepository.save(
                MemberEntity.builder()
                        .email(email)
                        .name(name)
                        .roleType(role)
                        .build());
    }

    protected MemberEntity createMember(String email, String name) {
        return createMember(email, name, MemberRoleType.WORKER);
    }

    protected ProjectCreateRequest createProjectRequest(
            String title,
            String content,
            Long pmId,
            List<Long> workerIds
    ) {
        return new ProjectCreateRequest(
                title,
                BASE_DATE,
                BASE_DATE.plusDays(10),
                content,
                pmId,
                workerIds);
    }

    public static class MemberCreationInfo {
        public String name;
        public String email;

        public MemberCreationInfo(String name, String email) {
            this.name = name;
            this.email = email;
        }
    }
}
