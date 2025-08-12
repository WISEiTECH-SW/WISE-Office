package kr.co.wise.office.api;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class HealthCheckController {
    

    @GetMapping("/health")
    public String getMethodName() {
        return "status OK";
    }
    
}
