/**
 * 프로젝트의 시작일과 종료일을 기반으로 현재 몇 년차인지 계산하는 함수
 * @param startDate 프로젝트 시작일 (Date 객체)
 * @param endDate 프로젝트 종료일 (Date 객체)
 * @returns 문자열
 */
export const calculateProjectDuration = (
    startDate: Date,
    endDate: Date
): string => {
    const currentDate = new Date();

    if (currentDate > endDate) {
        return "종료됨";
    }

    if (currentDate < startDate) {
        return "시작 예정";
    }

    const startYear = startDate.getFullYear();
    const currentYear = currentDate.getFullYear();
    const duration = currentYear - startYear + 1;

    return `${duration}년차`;
};

/**
 * Date 객체를 'YYYY.MM' 형식의 문자열로 변환하는 함수
 * @param date 변환할 Date 객체
 * @returns 'YYYY.MM' 형식의 문자열
 */
export const formatDateToYearMonth = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    return `${year}.${month}`;
};

/**
 * 참여자 배열의 길이를 계산하여 총 인원 수를 반환하는 함수
 * @param attendants 참여자 배열
 * @returns 참여자 수(number)
 */
export const getAttendantCount = (attendants: string[]): number => {
    if (!attendants) {
        return 0;
    }
    return attendants.length;
};
