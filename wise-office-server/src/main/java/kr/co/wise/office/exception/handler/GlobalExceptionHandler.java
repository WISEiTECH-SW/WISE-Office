package kr.co.wise.office.exception.handler;

import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import kr.co.wise.office.exception.dto.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApplicationRuntimeException.class)
    public ResponseEntity<ErrorResponse> handleApplicationRuntimeException(ApplicationRuntimeException e) {
        ErrorMessage errorMessage = e.getErrorMessage();
        ErrorResponse errorResponse = ErrorResponse.of(
                errorMessage.getStatus().value(),
                errorMessage.getMessage(),
                Collections.EMPTY_MAP
        );
        log.warn("ApplicationException: {}", errorResponse);
        return ResponseEntity.status(errorMessage.getStatus()).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        ErrorResponse errorResponse = ErrorResponse.of(
                500,
                "서버에 알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
                Collections.EMPTY_MAP
        );
        log.error("UnHandledException: {}", e.getMessage(), e);
        return ResponseEntity.status(500).body(errorResponse);
    }

    /**
     *  Validation 검증이 실패한 경우 실행되는 핸들러
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException validException) {
        Map<String, String> errors = new HashMap<>();

        BindingResult bindingResult = validException.getBindingResult();
        bindingResult.getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        bindingResult.getGlobalErrors().forEach(error ->
                errors.put(error.getObjectName(), error.getDefaultMessage()));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), "DTO Error", errors));
    }
}