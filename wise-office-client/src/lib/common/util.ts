/**
 * 프로젝트의 시작일과 종료일을 기반으로 현재 몇 년차인지 계산하는 함수
 * @param startDate 프로젝트 시작일 (Date 객체)
 * @param endDate 프로젝트 종료일 (Date 객체)
 * @returns 문자열
 */
export function calculationDuration(startDate: Date, endDate: Date) {
    const currentDate = new Date();

    if (currentDate > endDate) {
        return "종료됨";
    }

    if (currentDate < startDate) {
        return "시작 예정";
    }
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();

    return `${endYear - startYear + 1}년차`;
}

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
