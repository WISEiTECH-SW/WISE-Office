package kr.co.wise.office.external.hoilday.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Holiday API 응답 역직렬화 테스트")
class HolidayApiResponseDeserializationTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("items가 빈 문자열이면 빈 목록으로 역직렬화한다")
    void items가_빈문자열이면_빈목록으로_역직렬화한다() throws Exception {
        // given
        String json = """
                {
                  "response": {
                    "header": {
                      "resultCode": "00",
                      "resultMsg": "NORMAL SERVICE."
                    },
                    "body": {
                      "items": "",
                      "numOfRows": 10,
                      "pageNo": 1,
                      "totalCount": 0
                    }
                  }
                }
                """;

        // when
        HolidayApiResponse response = objectMapper.readValue(json, HolidayApiResponse.class);

        // then
        assertThat(response.response().body().items()).isNotNull();
        assertThat(response.response().body().items().item()).isEmpty();
        assertThat(response.response().body().totalCount()).isZero();
    }

    @Test
    @DisplayName("items.item이 배열이면 기존처럼 목록으로 역직렬화한다")
    void items_item이_배열이면_목록으로_역직렬화한다() throws Exception {
        // given
        String json = """
                {
                  "response": {
                    "header": {
                      "resultCode": "00",
                      "resultMsg": "NORMAL SERVICE."
                    },
                    "body": {
                      "items": {
                        "item": [
                          {
                            "dateName": "삼일절",
                            "isHoliday": "Y",
                            "locdate": 20260301
                          }
                        ]
                      },
                      "numOfRows": 10,
                      "pageNo": 1,
                      "totalCount": 1
                    }
                  }
                }
                """;

        // when
        HolidayApiResponse response = objectMapper.readValue(json, HolidayApiResponse.class);

        // then
        assertThat(response.response().body().items().item()).hasSize(1);
        assertThat(response.response().body().items().item().get(0).dateName()).isEqualTo("삼일절");
        assertThat(response.response().body().items().item().get(0).locdate()).isEqualTo(20260301);
    }

    @Test
    @DisplayName("items.item이 단일 객체여도 목록 하나로 역직렬화한다")
    void items_item이_단일객체여도_목록하나로_역직렬화한다() throws Exception {
        // given
        String json = """
                {
                  "response": {
                    "header": {
                      "resultCode": "00",
                      "resultMsg": "NORMAL SERVICE."
                    },
                    "body": {
                      "items": {
                        "item": {
                          "dateName": "신정",
                          "isHoliday": "Y",
                          "locdate": 20260101
                        }
                      },
                      "numOfRows": 10,
                      "pageNo": 1,
                      "totalCount": 1
                    }
                  }
                }
                """;

        // when
        HolidayApiResponse response = objectMapper.readValue(json, HolidayApiResponse.class);

        // then
        assertThat(response.response().body().items().item()).hasSize(1);
        assertThat(response.response().body().items().item().get(0).dateName()).isEqualTo("신정");
        assertThat(response.response().body().items().item().get(0).locdate()).isEqualTo(20260101);
    }
}
