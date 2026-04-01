import {
    eachDayOfInterval,
    endOfWeek,
    endOfYear,
    format,
    isWeekend,
    startOfWeek,
    startOfYear,
} from "date-fns";
import type { Row } from "@/types/annualLeave";
import type {
    LeaveHeatmapEntry,
    LeaveHeatmapWeek,
    LeaveSummaryTotals,
    LeaveTypeGroup,
} from "@/types/leaveHeatmap";

const ANNUAL_CATEGORIES = new Set(["연차", "반차(오후)", "반차(오전)", "반반차"]);
const SUBSTITUTE_CATEGORIES = new Set([
    "대체반차(오전)",
    "대체반차(오후)",
    "대체",
]);
const DEFENSE_CATEGORIES = new Set(["국방(반차)", "국방"]);

export const LEAVE_GROUP_ORDER: LeaveTypeGroup[] = [
    "annual",
    "substitute",
    "official",
    "defense",
];

export const LEAVE_GROUP_META: Record<
    LeaveTypeGroup,
    {
        label: string;
        color: string;
    }
> = {
    annual: {
        label: "연차/반차",
        color: "#3b82f6",
    },
    substitute: {
        label: "대체휴가",
        color: "#16a34a",
    },
    official: {
        label: "공가",
        color: "#f59e0b",
    },
    defense: {
        label: "국방휴가",
        color: "#ec4899",
    },
};

function createEmptySummary(): LeaveSummaryTotals {
    return {
        annualUsed: 0,
        substituteLeaveUsed: 0,
        officialLeaveUsed: 0,
        defenseLeaveUsed: 0,
    };
}

function parseDateToken(token: string): Date {
    const [year, month, day] = token.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function sortGroups(groups: LeaveTypeGroup[]): LeaveTypeGroup[] {
    return [...groups].sort(
        (left, right) =>
            LEAVE_GROUP_ORDER.indexOf(left) - LEAVE_GROUP_ORDER.indexOf(right),
    );
}

function getLeaveDays(days: string): number {
    const parsedDays = Number(days);
    return Number.isFinite(parsedDays) ? parsedDays : 0;
}

function buildApprovedLeaveEntriesByDate(rows: Row[], year: number) {
    const entriesByDate = new Map<string, LeaveHeatmapEntry[]>();

    rows.forEach((row) => {
        if (!isApprovedTrackedLeave(row)) {
            return;
        }

        const group = getLeaveTypeGroup(row.category);
        const range = parseLeaveDateRange(row.date);

        if (!group || !range) {
            return;
        }

        eachDayOfInterval({ start: range.start, end: range.end }).forEach(
            (date) => {
                if (date.getFullYear() !== year || isWeekend(date)) {
                    return;
                }

                const dateKey = format(date, "yyyy-MM-dd");
                const nextEntries = entriesByDate.get(dateKey) ?? [];

                nextEntries.push({
                    date,
                    dateKey,
                    group,
                    category: row.category,
                    days: getLeaveDays(row.days),
                    status: row.status,
                    row,
                });

                entriesByDate.set(dateKey, nextEntries);
            },
        );
    });

    entriesByDate.forEach((entries, dateKey) => {
        entriesByDate.set(
            dateKey,
            [...entries].sort(
                (left, right) =>
                    LEAVE_GROUP_ORDER.indexOf(left.group) -
                    LEAVE_GROUP_ORDER.indexOf(right.group),
            ),
        );
    });

    return entriesByDate;
}

function addGroupSummary(
    summary: LeaveSummaryTotals,
    group: LeaveTypeGroup,
    days: number,
) {
    switch (group) {
        case "annual":
            summary.annualUsed += days;
            break;
        case "substitute":
            summary.substituteLeaveUsed += days;
            break;
        case "official":
            summary.officialLeaveUsed += days;
            break;
        case "defense":
            summary.defenseLeaveUsed += days;
            break;
    }
}

export function getLeaveTypeGroup(category: string): LeaveTypeGroup | null {
    if (ANNUAL_CATEGORIES.has(category)) return "annual";
    if (SUBSTITUTE_CATEGORIES.has(category)) return "substitute";
    if (category === "공가") return "official";
    if (DEFENSE_CATEGORIES.has(category)) return "defense";
    return null;
}

export function isApprovedTrackedLeave(row: Row) {
    return row.status === "결재" && getLeaveTypeGroup(row.category) !== null;
}

export function parseLeaveDateRange(value: string) {
    const matchedDates = value.match(/\d{4}-\d{2}-\d{2}/g);

    if (!matchedDates || matchedDates.length === 0) {
        return null;
    }

    const start = parseDateToken(matchedDates[0]);
    const end =
        matchedDates.length > 1 ? parseDateToken(matchedDates[1]) : start;

    if (end.getTime() < start.getTime()) {
        return { start, end: start };
    }

    return { start, end };
}

export function getLeaveStartYear(row: Row) {
    const range = parseLeaveDateRange(row.date);
    return range ? range.start.getFullYear() : null;
}

export function getTrackedLeaveYears(rows: Row[]) {
    const years = new Set<number>();

    rows.forEach((row) => {
        if (!isApprovedTrackedLeave(row)) {
            return;
        }

        const range = parseLeaveDateRange(row.date);
        if (!range) {
            return;
        }

        for (
            let targetYear = range.start.getFullYear();
            targetYear <= range.end.getFullYear();
            targetYear++
        ) {
            years.add(targetYear);
        }
    });

    return Array.from(years).sort((left, right) => left - right);
}

export function summarizeApprovedLeaveRows(rows: Row[]): LeaveSummaryTotals {
    return rows.reduce((summary, row) => {
        if (!isApprovedTrackedLeave(row)) {
            return summary;
        }

        const group = getLeaveTypeGroup(row.category);
        if (!group) {
            return summary;
        }

        addGroupSummary(summary, group, getLeaveDays(row.days));
        return summary;
    }, createEmptySummary());
}

export function summarizeApprovedLeaveRowsByYear(
    rows: Row[],
    year: number,
): LeaveSummaryTotals {
    return rows.reduce((summary, row) => {
        if (!isApprovedTrackedLeave(row) || getLeaveStartYear(row) !== year) {
            return summary;
        }

        const group = getLeaveTypeGroup(row.category);
        if (!group) {
            return summary;
        }

        addGroupSummary(summary, group, getLeaveDays(row.days));
        return summary;
    }, createEmptySummary());
}

export function buildLeaveHeatmapWeeks(
    rows: Row[],
    year: number,
): LeaveHeatmapWeek[] {
    const entriesByDate = buildApprovedLeaveEntriesByDate(rows, year);

    const gridStart = startOfWeek(startOfYear(new Date(year, 0, 1)), {
        weekStartsOn: 1,
    });
    const gridEnd = endOfWeek(endOfYear(new Date(year, 0, 1)), {
        weekStartsOn: 1,
    });
    const calendarDays = eachDayOfInterval({
        start: gridStart,
        end: gridEnd,
    });

    const weeks: LeaveHeatmapWeek[] = [];

    for (let index = 0; index < calendarDays.length; index += 7) {
        const days = calendarDays.slice(index, index + 7).map((date) => {
            const dateKey = format(date, "yyyy-MM-dd");
            const entries = entriesByDate.get(dateKey) ?? [];
            const groups = sortGroups(
                Array.from(new Set(entries.map((entry) => entry.group))),
            );

            return {
                date,
                dateKey,
                isCurrentYear: date.getFullYear() === year,
                entries,
                groups,
            };
        });

        const monthLabelDate = days.find(
            (day) => day.isCurrentYear && day.date.getDate() === 1,
        );

        weeks.push({
            label: monthLabelDate ? format(monthLabelDate.date, "M월") : null,
            days,
        });
    }

    return weeks;
}
