package kr.co.wise.office.external.hoilday;

import kr.co.wise.office.external.hoilday.dto.HolidayApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * 공공 데이터 포털 한국천문연구원_특일 정보 호출 API
 */
@Component
@Slf4j
public class HolidayApiClient {

    private RestClient holidayApiClient;
    private String apiKey;

    public HolidayApiClient(@Qualifier("holidayRestClient") RestClient holidayClient,
                            @Value("${holiday.api.key}") String apiKey) {
        this.holidayApiClient = holidayClient;
        this.apiKey = apiKey;
    }

    /**
     * 특정 년/월에 해당하는 공휴일 정보를 얻어옴 (국가 공휴일 및 임시 공휴일)
     */
    public HolidayApiResponse getHoliday(int year, int month) {
        String monthFormat = String.format("%02d", month); // 월은 두자리 수로 제공해야 함
        return holidayApiClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/B090041/openapi/service/SpcdeInfoService/getRestDeInfo")
                        .queryParam("solYear", year)
                        .queryParam("solMonth", monthFormat)
                        .queryParam("_type", "json")
                        .queryParam("serviceKey", apiKey)
                        .build())
                .retrieve()
                .body(HolidayApiResponse.class);
    }

}
