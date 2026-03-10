package kr.co.wise.office.util;


import java.time.format.DateTimeFormatter;

public final class DateUtil {

    public static final DateTimeFormatter titleFormatter = DateTimeFormatter.ofPattern("yyyy-MMdd");
    public static final DateTimeFormatter approveDateFormatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일"); // XXXX년 YY월 ZZ일
    public static final DateTimeFormatter writtenAtDateFormatter = DateTimeFormatter.ofPattern("yyyy.MM.dd."); // XXXX년 YY월 ZZ일

    private DateUtil() {}

}
