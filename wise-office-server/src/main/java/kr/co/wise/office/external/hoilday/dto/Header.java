package kr.co.wise.office.external.hoilday.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Header(String resultCode, String resultMsg) {}