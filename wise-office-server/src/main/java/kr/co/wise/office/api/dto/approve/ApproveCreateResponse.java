package kr.co.wise.office.api.dto.approve;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.wise.office.domain.approve.entity.ApproveEntity;
import kr.co.wise.office.domain.minutes.entity.MinutesEntity;
import lombok.Builder;

import static kr.co.wise.office.util.DateUtil.approveDateFormatter;
import static kr.co.wise.office.util.DateUtil.writtenAtDateFormatter;

@Builder
public record ApproveCreateResponse(
        @Schema(type = "number", description = "조회한 품의서 ID") long approveId,
        @Schema(type = "number", description = "조회된 품의서와 연계된 회의록 ID") long minutesId, // 해당 품의서를 작성한 회의록 번호
        @Schema(type = "string", description = "문서번호") String approveNo,
        @Schema(type = "string", description = "작성일자") String writtenAt,
        @Schema(type = "string", description = "품의자") String writer,
        @Schema(type = "string", description = "접수일자") String submitAt,
        @Schema(type = "string", description = "사업명") String businessName,
        @Schema(type = "string", description = "과제명") String title,
        @Schema(type = "string", description = "전담기관") String institution,
        @Schema(type = "string", description = "회의 일시") String minutesAt,
        @Schema(type = "string", description = "회의 목적") String minutesPurpose
) {
    public static ApproveCreateResponse of(MinutesEntity minutesEntity, ApproveEntity approve, String writer) {
        return ApproveCreateResponse
                .builder()
                .approveId(approve.getId())
                .minutesId(minutesEntity.getId())
                .approveNo(approve.getReportNo())
                .writtenAt(approve.getWriteDate().format(writtenAtDateFormatter))
                .writer(writer)
                .submitAt(approve.getSubmitDate().format(writtenAtDateFormatter))
                .businessName(minutesEntity.getProject().getBusinessName())
                .title(minutesEntity.getProject().getTitle())
                .institution(minutesEntity.getProject().getInstitution())
                .minutesAt(minutesEntity.getMinutesDate().format(approveDateFormatter))
                .minutesPurpose(minutesEntity.getPurpose())
                .build();
    }
}
