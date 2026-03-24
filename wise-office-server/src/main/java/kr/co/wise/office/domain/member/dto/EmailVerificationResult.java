package kr.co.wise.office.domain.member.dto;

public record EmailVerificationResult(boolean verification, String successCode) {

    public static EmailVerificationResult of(boolean verification) {
        return new EmailVerificationResult(verification, "");
    }

    public static EmailVerificationResult from(boolean verification, String successCode) {
        return new EmailVerificationResult(verification, successCode);
    }


}
