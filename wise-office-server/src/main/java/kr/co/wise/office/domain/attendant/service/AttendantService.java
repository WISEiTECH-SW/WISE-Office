package kr.co.wise.office.domain.attendant.service;

import kr.co.wise.office.domain.Project.entity.ProjectEntity;
import kr.co.wise.office.domain.attendant.entity.AttendantEntity;
import kr.co.wise.office.domain.attendant.repository.AttendantRepository;
import kr.co.wise.office.domain.member.entity.MemberEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class AttendantService {

    private final AttendantRepository attendantRepository;

    public void makeAttandants(List<MemberEntity> attendants, ProjectEntity project) {
        List<AttendantEntity> entities = attendants.stream().map(attendant -> {
            AttendantEntity entity = AttendantEntity.builder()
                    .member(attendant)
                    .project(project)
                    .build();
            return entity;
        }).toList();

        attendantRepository.saveAll(entities);
    }


    public Map<Long, List<String>> getAttendantsName(List<Long> projectIds) {
        List<AttendantEntity> allWithMemberAndProject = attendantRepository.findAllWithMemberAndProject(projectIds)
                .orElse(Collections.emptyList());

        return allWithMemberAndProject.stream()
                .collect(Collectors.groupingBy(
                        // KEY 값 설정
                        attendant -> attendant.getProject().getId(),
                        // Value 설정 => List<String>
                        Collectors.mapping(
                                attendant -> attendant.getMember().getName(),
                                Collectors.toList()
                        )
                ));
    }

}
