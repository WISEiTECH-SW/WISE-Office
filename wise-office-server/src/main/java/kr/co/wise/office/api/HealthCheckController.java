package kr.co.wise.office.api;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@Tag(name = "health check", description = "spring 서버 정상 작동 확인")
public class HealthCheckController {
    

    @GetMapping("/health")
    public String getMethodName() {
        return "status OK";
    }

    @RequestMapping("favicon.ico")
    public ResponseEntity<Void> favicon() {
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
