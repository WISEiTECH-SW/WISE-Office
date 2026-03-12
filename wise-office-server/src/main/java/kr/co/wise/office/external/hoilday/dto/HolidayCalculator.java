package kr.co.wise.office.external.hoilday.dto;

import kr.co.wise.office.external.hoilday.HolidayProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class HolidayCalculator {

    private final HolidayProvider holidayProvider;

    /**
     * 작성일자 및 접수일자 계산
     * 두 일자는 회의록 작성 전날 중, 휴일 및 공휴일이 아닌 평일로 계산
     * 예를 들어 회의 날짜가 2026년 3월 3일인 경우,
     * 3월 2일은 임시 공휴일, 3월 1일, 3월 2일은 주말이므로
     * 기안날짜는 2월 27일어야 함.
     */
    public LocalDate calculateSubmitDate(LocalDate minutesDate) {
        Set<LocalDate> holidaySet = holidayProvider.getHolidaySet(minutesDate.getYear(), minutesDate.getMonthValue());
        LocalDate startDate = minutesDate;
        LocalDate submitDate = minutesDate.minusDays(1);
        while (isWeekend(submitDate) || holidaySet.contains(submitDate)) {
            submitDate = submitDate.minusDays(1);

            // 월이 바뀌는 경우 계산
            if (submitDate.getMonthValue() != startDate.getMonthValue()) {
                holidaySet = holidayProvider.getHolidaySet(submitDate.getYear(), submitDate.getMonthValue());
                startDate = submitDate;
            }
        }
        return submitDate;
    }

    private boolean isWeekend(LocalDate submitDate) {
        DayOfWeek dayOfWeek = submitDate.getDayOfWeek();
        return dayOfWeek == DayOfWeek.SUNDAY || dayOfWeek == DayOfWeek.SATURDAY;
    }


}
