package kr.co.wise.office.external.hoilday;

import kr.co.wise.office.external.hoilday.dto.HolidayApiResponse;
import kr.co.wise.office.external.hoilday.dto.HolidayItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HolidayProvider {

    private final HolidayApiClient client;

    /**
     * 여러 번 같은 월에 대한 API 호출은 불필요 하므로
     * 캐시처리하여 제공
     */
    @Cacheable(value = "holidays", key = "#year + '-' + #month")
    public Set<LocalDate> getHolidaySet(int year, int month) {
        log.info("{}년 {}월 공휴일 조회!", year, month);
        HolidayApiResponse holiday = client.getHoliday(year, month);
        if (holiday == null) {
            return Collections.emptySet();
        }

        List<HolidayItem> items = holiday.response().body().items().item();
        if (items.isEmpty()) {
            return Collections.emptySet();
        }

        return items.stream()
                .filter(item -> "Y".equals(item.isHoliday()))
                .map(item -> LocalDate.parse(String.valueOf(item.locdate()), DateTimeFormatter.BASIC_ISO_DATE))
                .collect(Collectors.toSet());
    }

}
