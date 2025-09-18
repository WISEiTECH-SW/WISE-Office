package kr.co.wise.office.exception.handler;

import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import kr.co.wise.office.exception.dto.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException validException) {
        Map<String, String> errors = new HashMap<>();

        BindingResult bindingResult = validException.getBindingResult();
        bindingResult.getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        bindingResult.getGlobalErrors().forEach(error ->
                errors.put(error.getObjectName(), error.getDefaultMessage()));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(makeErrorResponse("DTO Error", errors));
    }

    /**
     * RequestParam, PathVariable의 validation 실패시 호출되는 handler
     */
    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(HandlerMethodValidationException ex) {
        Map<String, String> errors = new HashMap<>();

        for (var validationResult : ex.getAllValidationResults()) {
            String parameterName = validationResult.getMethodParameter().getParameterName();
            String errorMessage = validationResult.getResolvableErrors().get(0).getDefaultMessage();
            errors.put(parameterName, errorMessage);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(makeErrorResponse("Request Param 에러", errors));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMisMatchException(MethodArgumentTypeMismatchException ex) {
        String errorMessage = ex.getName() + "은 반드시 양의 정수값이여야 합니다.";
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(makeErrorResponse(errorMessage, Collections.EMPTY_MAP));
    }


    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    protected ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(makeErrorResponse("지원하지 않는 HTTP Method 입니다.", Collections.EMPTY_MAP));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxSizeException(MaxUploadSizeExceededException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(makeErrorResponse("5MB 이하의 이미지를 업로드해 주세요.", Collections.EMPTY_MAP));
    }

    public ErrorResponse makeErrorResponse(String message, Map<String, String> errors) {
        return ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), message, errors);
    }
}