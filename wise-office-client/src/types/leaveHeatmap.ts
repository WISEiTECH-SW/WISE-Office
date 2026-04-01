import type { Row } from "./annualLeave";

export type LeaveTypeGroup =
    | "annual"
    | "substitute"
    | "official"
    | "defense";

export type LeaveSummaryTotals = {
    annualUsed: number;
    substituteLeaveUsed: number;
    officialLeaveUsed: number;
    defenseLeaveUsed: number;
};

export type LeaveHeatmapEntry = {
    date: Date;
    dateKey: string;
    group: LeaveTypeGroup;
    category: string;
    days: number;
    status: string;
    row: Row;
};

export type LeaveHeatmapCell = {
    date: Date;
    dateKey: string;
    isCurrentYear: boolean;
    entries: LeaveHeatmapEntry[];
    groups: LeaveTypeGroup[];
};

export type LeaveHeatmapWeek = {
    label: string | null;
    days: LeaveHeatmapCell[];
};
