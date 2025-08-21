/**
 * 프로젝트의 시작일과 종료일을 기반으로 현재 몇 년차인지 계산하는 함수
 * @param startDate 프로젝트 시작일 (Date 객체)
 * @param endDate 프로젝트 종료일 (Date 객체)
 * @returns 문자열
 */
export function calculationDuration(startDate: Date, endDate: Date) {
type ProjectState = {
    duration: string;
    state: string;
    stateColor: string;
    textColor: string;
};

export const calculateProjectDuration = (
    start: string,
    end: string
): ProjectState => {
    const currentDate = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (currentDate > endDate) {
        return {
            duration: "프로젝트 종료",
            state: "종료됨",
            stateColor: "bg-gray-200",
            textColor: "text-gray-700",
        };
    }

    if (currentDate < startDate) {
        return {
            duration: "진행 예정",
            state: "진행전",
            stateColor: "bg-cyan-100",
            textColor: "text-cyan-700",
        };
    }

    const startYear = new Date(startDate).getFullYear();
    const currentYear = new Date(currentDate).getFullYear();
    return `${currentYear - startYear + 1}년차`;
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
