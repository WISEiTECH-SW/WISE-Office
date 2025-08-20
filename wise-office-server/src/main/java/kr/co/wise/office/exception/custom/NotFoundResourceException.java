package kr.co.wise.office.exception.custom;

import kr.co.wise.office.exception.ErrorMessage;

public class NotFoundResourceException extends ApplicationRuntimeException {

    public NotFoundResourceException(ErrorMessage errorMessage) {
        super(errorMessage);
    }

}
