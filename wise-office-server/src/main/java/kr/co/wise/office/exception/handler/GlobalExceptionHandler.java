package kr.co.wise.office.exception.handler;

import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.dto.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApplicationRuntimeException.class)
    public ResponseEntity<ErrorResponse> handleApplicationRuntimeException(ApplicationRuntimeException e) {
        ErrorMessage errorMessage = e.getErrorMessage();
        ErrorResponse errorResponse = ErrorResponse.of(
                errorMessage.getStatus().value(),
                errorMessage.getMessage()
        );
        log.warn("ApplicationException: {}", errorResponse);
        return ResponseEntity.status(errorMessage.getStatus()).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        ErrorResponse errorResponse = ErrorResponse.of(
                500,
                "서버에 알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        log.error("UnHandledException: {}", e.getMessage(), e);
        return ResponseEntity.status(500).body(errorResponse);
    }
}