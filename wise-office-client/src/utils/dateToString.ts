import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

export function dateToString(d: Date): string {
    const pad2 = (n: number) => String(n).padStart(2, "0");
    const toYYYYMMDD = (d: Date) =>
        `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

    return toYYYYMMDD(d);
}

export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function isOverOneYear(today: Date, joinDate: string): boolean {
    const plusOneYear = new Date(joinDate);
    plusOneYear.setFullYear(plusOneYear.getFullYear() + 1);
    return dateToString(today) >= dateToString(plusOneYear);
}

export const formatMeetingDate = (minutesDate: string) => {
    if (!minutesDate) return "";

    return dayjs(minutesDate).format("YYYY년 MM월 DD일 dddd");
};

export const formatMeetingTime = (startTime: string, endTime: string) => {
    return `${startTime} ~ ${endTime}`;
};
