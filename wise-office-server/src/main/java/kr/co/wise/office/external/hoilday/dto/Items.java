package kr.co.wise.office.external.hoilday.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Items(List<HolidayItem> item) {
    public Items {
        if (item == null) {
            item = List.of();
        }
    }
}
