package kr.co.wise.office.external.hoilday.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record HolidayItem(
        String dateName,
        String isHoliday,
        int locdate // YYYYMMDD 형태의 정수
) {}
