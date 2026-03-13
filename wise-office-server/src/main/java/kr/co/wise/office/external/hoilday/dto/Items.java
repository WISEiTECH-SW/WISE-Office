package kr.co.wise.office.external.hoilday.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonDeserialize(using = ItemsDeserializer.class)
public record Items(List<HolidayItem> item) {
    public Items {
        if (item == null) {
            item = List.of();
        } else {
            item = List.copyOf(item);
        }
    }
}
