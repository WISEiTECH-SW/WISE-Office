package kr.co.wise.office.exception.custom;

import kr.co.wise.office.exception.ErrorMessage;

public class UnAuthorizationException extends ApplicationRuntimeException{

    public UnAuthorizationException(ErrorMessage errorMessage) {
        super(errorMessage);
    }

}
