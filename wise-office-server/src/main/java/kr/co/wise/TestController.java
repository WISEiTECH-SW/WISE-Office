package kr.co.wise;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class TestController {
    

    @GetMapping("/health")
    public String getMethodName() {
        return "status OK";
    }
    
}
