package kr.co.wise.office.util;

import jakarta.servlet.http.Cookie;

public abstract class CookieUtils {

    public static final int COOKIE_EXPIRATION_SECONDES = 1800;

    public static Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // http 환경에서 사용
        cookie.setPath("/");
        cookie.setMaxAge(COOKIE_EXPIRATION_SECONDES);
        return cookie;
    }

    public static Cookie createCookie(String key, String value, int age) {
        Cookie cookie = createCookie(key, value);
        cookie.setMaxAge(age);
        return cookie;
    }

    private CookieUtils() {}
}
