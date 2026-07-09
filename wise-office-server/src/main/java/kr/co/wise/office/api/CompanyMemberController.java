package kr.co.wise.office.api;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.wise.office.domain.companymember.service.CompanyMemberService;
import kr.co.wise.office.domain.member.dto.CustomOAuthUser;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@AllArgsConstructor
@Tag(name = "사원 업데이트", description = "사원 업데이트 API")
@RequestMapping("/api/v1/company-members")
public class CompanyMemberController {

    private final CompanyMemberService companyMemberService;


    @PatchMapping
    public ResponseEntity<Void> updateCompanyMember(
            @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(description = "업데이트 리스트, 사원 조회 쪽 복사") @RequestPart("list") MultipartFile list
    ) {
        if (list == null || list.isEmpty()) {
            throw new ApplicationRuntimeException(ErrorMessage.REJECT_REQUEST);
        }

        String fileName = list.getOriginalFilename();
        if (fileName == null || !fileName.endsWith(".txt")) {
            throw new ApplicationRuntimeException(ErrorMessage.REJECT_REQUEST);
        }

        companyMemberService.updateCompanyMemberInfo(list);

        return ResponseEntity.ok().build();
    }






}
