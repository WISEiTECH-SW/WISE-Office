package kr.co.wise.office.api;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.companymember.service.CompanyMemberService;
import kr.co.wise.office.domain.member.dto.CustomOAuthUser;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@AllArgsConstructor
//@Tag(name = "사원 업데이트", description = "사원 업데이트 API")
@RequestMapping("/api/v1/company-members")
public class CompanyMemberController {

    private final CompanyMemberService companyMemberService;

    /**
     * 26-07-14 회사 사원 업데이트는 서버 재실행시 진행되도록 설정하여 API 주석처리 진행  
     */
//    @Operation(summary = "사원 목록 업데이트", description = "편성 인원에 선택될 사원 목록 업데이트",
//            security = @SecurityRequirement(name = "bearerAuth"))
//    @PatchMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateCompanyMember(
            @AuthenticationPrincipal CustomOAuthUser loginUser,
            @Parameter(
                    description = "업데이트 리스트 파일, 사원 조회 쪽 복사(사원명 컬럼부터 Email 컬럼까지)",
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE),
                    schema = @Schema(type = "string", format = "binary")
            )
            @RequestPart("list") MultipartFile list
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
