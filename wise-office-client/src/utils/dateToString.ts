export function dateToString(d: Date): string {
    const pad2 = (n: number) => String(n).padStart(2, "0");
    const toYYYYMMDD = (d: Date) =>
        `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

    return toYYYYMMDD(d);
}

export function isOverOneYear(today: Date, joinDate: string): boolean {
    const plusOneYear = new Date(joinDate);
    plusOneYear.setFullYear(plusOneYear.getFullYear() + 1);
    return dateToString(today) >= dateToString(plusOneYear);
}
