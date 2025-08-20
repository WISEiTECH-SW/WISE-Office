package kr.co.wise.office.exception.custom;

import kr.co.wise.office.exception.ErrorMessage;

public class ApplicationRuntimeException extends RuntimeException {

    private ErrorMessage errorMessage;

    public ApplicationRuntimeException(ErrorMessage errorMessage) {
        this.errorMessage = errorMessage;
    }

    public ErrorMessage getErrorMessage() {
        return errorMessage;
    }
}
