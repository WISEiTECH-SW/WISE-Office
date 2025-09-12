import dayjs from "dayjs";

type ProjectState = {
    duration: string;
    state: string;
    stateColor: string;
    textColor: string;
};

export const calculateProjectDuration = (
    start: Date,
    end: Date
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

    const startYear = startDate.getFullYear();
    const currentYear = currentDate.getFullYear();
    const duration = currentYear - startYear + 1;

    return {
        duration: `${duration}차년도`,
        state: "진행중",
        stateColor: "bg-emerald-100",
        textColor: "text-emerald-700",
    };
};

/**
 * 프로젝트의 시작일과 종료일을 기반으로 현재 몇 년차인지 계산하는 함수
 * @param startDate 프로젝트 시작일 (Date 객체)
 * @returns 문자열
 */
export function calculationDuration(startDate: Date) {
    const currentDate = new Date();
    const startYear = new Date(startDate).getFullYear();
    const currentYear = new Date(currentDate).getFullYear();
    return `${currentYear - startYear + 1}년차`;
}

/**
 * string 형태의 time 형태를 YYYY-MM-DD HH:MM 형태의 string으로 반환해주는 함수
 * @param dateStr time stamp 형태의 string 시간 데이터
 * @returns 변경된 형태의 string
 */
export const formatDateTime = (dateStr: string) => {
    return dayjs(dateStr).format("YYYY-MM-DD • HH:mm");
};

/**
 * Date 데이터를 YYYY-MM 형태의 string으로 반환해주는 함수
 * @param dateStr string 형태의 시간 데이터
 * @returns YYYY-MM 형태의 string
 */
export const formatYearMonth = (dateStr: Date) => {
    return dayjs(dateStr).format("YYYY-MM");
};
