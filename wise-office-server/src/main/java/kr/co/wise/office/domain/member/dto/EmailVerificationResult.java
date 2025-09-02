package kr.co.wise.office.domain.member.dto;

public record EmailVerificationResult(boolean verification) {

    public static EmailVerificationResult of(boolean verification) {
        return new EmailVerificationResult(verification);
    }
}
