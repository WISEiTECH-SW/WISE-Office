package kr.co.wise.office.setup;


import kr.co.wise.office.domain.companymember.entity.CompanyMemberEntity;
import kr.co.wise.office.domain.companymember.repository.CompanyMemberEntityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

/**
 * DB 생성시 최초 한 번만 실행되며 전사 사원 데이터가 데이터베이스에 저장됩니다.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CompanyMemberInitRunner implements CommandLineRunner {

    private final CompanyMemberEntityRepository companyMemberEntityRepository;

    @Override
    public void run(String... args) throws Exception {
        // 초기 데이터가 삽입되었는지 확인
        long count = companyMemberEntityRepository.count();
        if (count > 0) {
            log.info("이미 기존 사원 데이터가 추가되어 있습니다.");
            return;
        }

        // 전사 사원 데이터 추가
        ClassPathResource initResourcePath = new ClassPathResource("init/memberList-260304.txt");
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(initResourcePath.getInputStream()))){
            List<CompanyMemberEntity> companyMemberEntities = new ArrayList<>();
            reader.lines().forEach(line -> {
                String[] split = line.split("\t");
                String name = split[0];
                String team = split[1];
                String rank = split[2];

                CompanyMemberEntity companyMemberEntity = CompanyMemberEntity.builder()
                        .team(team)
                        .name(name)
                        .rank(rank)
                        .build();
                companyMemberEntities.add(companyMemberEntity);
            });
            companyMemberEntityRepository.saveAllAndFlush(companyMemberEntities);
            log.info("초기 데이터 {}건 삽입 완료", companyMemberEntities.size());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
