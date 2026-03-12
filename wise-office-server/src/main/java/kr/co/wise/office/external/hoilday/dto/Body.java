package kr.co.wise.office.external.hoilday.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Body(Items items, int numOfRows, int pageNo, int totalCount) {
    public Body {
        if (items == null) {
            items = new Items(List.of());
        }
    }
}
