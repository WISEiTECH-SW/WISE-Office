import { useLeaveHeatmap } from "@/hooks/useLeaveHeatmap";
import { useLeaveSummaryByYear } from "@/hooks/useLeaveSummary";
import type { LeaveHeatmapCell, LeaveHeatmapEntry } from "@/types/leaveHeatmap";
import { LEAVE_GROUP_META } from "@/utils/leaveTracker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const CELL_SIZE_CLASS = "h-2 w-2 md:h-[12px] md:w-[12px]";

type TooltipPlacement = "start" | "center" | "end";

function getHalfDayDirection(category: string) {
    if (category.includes("(오전)")) {
        return "am";
    }

    if (category.includes("(오후)")) {
        return "pm";
    }

    return null;
}

function buildCellBackground(cell: LeaveHeatmapCell) {
    if (cell.groups.length === 0) {
        return "#f3f4f6";
    }

    const uniqueGroups = Array.from(
        new Set(cell.entries.map((entry) => entry.group)),
    );
    const halfDayDirections = cell.entries
        .map((entry) => getHalfDayDirection(entry.category))
        .filter((direction): direction is "am" | "pm" => direction !== null);

    if (
        cell.entries.length > 0 &&
        halfDayDirections.length === cell.entries.length &&
        uniqueGroups.length === 1
    ) {
        const color = LEAVE_GROUP_META[uniqueGroups[0]].color;
        const hasMorning = halfDayDirections.includes("am");
        const hasAfternoon = halfDayDirections.includes("pm");

        if (hasMorning && hasAfternoon) {
            return color;
        }

        if (hasMorning) {
            return `linear-gradient(90deg, ${color} 0%, ${color} 50%, #f3f4f6 50%, #f3f4f6 100%)`;
        }

        if (hasAfternoon) {
            return `linear-gradient(90deg, #f3f4f6 0%, #f3f4f6 50%, ${color} 50%, ${color} 100%)`;
        }
    }

    const colors = cell.groups.map((group) => LEAVE_GROUP_META[group].color);

    if (colors.length === 1) {
        return colors[0];
    }

    const segments = colors
        .map((color, index) => {
            const start = (index / colors.length) * 100;
            const end = ((index + 1) / colors.length) * 100;
            return `${color} ${start}%, ${color} ${end}%`;
        })
        .join(", ");

    return `linear-gradient(90deg, ${segments})`;
}

function getDayCountForCell(category: string): number {
    const halfDayDirection = getHalfDayDirection(category);
    return halfDayDirection !== null ? 0.5 : 1;
}

function formatDays(days: number) {
    return `${days}일`;
}

function HeatmapTooltip({
    entries,
    date,
    placement,
}: {
    entries: LeaveHeatmapEntry[];
    date: Date;
    placement: TooltipPlacement;
}) {
    const placementClass =
        placement === "start"
            ? "left-0"
            : placement === "end"
              ? "right-0"
              : "left-1/2 -translate-x-1/2";

    return (
        <div
            className={`absolute top-full z-20 mt-2 w-60 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-lg ${placementClass}`}
        >
            <p className="text-sm font-semibold text-gray-900">
                {format(date, "yyyy.MM.dd (EEE)", { locale: ko })}
            </p>
            <ul className="mt-2 space-y-1.5">
                {entries.map((entry, index) => (
                    <li
                        key={`${entry.category}-${entry.days}-${entry.row.requestedAt}-${index}`}
                        className="flex items-start gap-2 text-xs text-gray-600"
                    >
                        <span
                            className="mt-1 h-2.5 w-2.5 rounded-full"
                            style={{
                                backgroundColor:
                                    LEAVE_GROUP_META[entry.group].color,
                            }}
                        />
                        <span className="leading-4">
                            <span className="mr-1 text-gray-500">
                                {LEAVE_GROUP_META[entry.group].label}
                            </span>
                            <span className="font-medium text-gray-800">
                                {entry.category}
                            </span>
                            {` · ${formatDays(getDayCountForCell(entry.category))}`}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function HeatmapCell({
    cell,
    isActive,
    onOpen,
    onClose,
    onToggle,
    tooltipPlacement,
}: {
    cell: LeaveHeatmapCell;
    isActive: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
    tooltipPlacement: TooltipPlacement;
}) {
    if (!cell.isCurrentYear) {
        return <div className={CELL_SIZE_CLASS} />;
    }

    if (cell.entries.length === 0) {
        return (
            <div
                className={`${CELL_SIZE_CLASS} rounded-[4px] border border-gray-200 bg-gray-100`}
            />
        );
    }

    return (
        <div
            className={`${CELL_SIZE_CLASS} relative`}
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
        >
            <button
                type="button"
                onClick={onToggle}
                onFocus={onOpen}
                onBlur={onClose}
                className="block h-full w-full cursor-pointer rounded-[4px] border border-white/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{
                    background: buildCellBackground(cell),
                }}
                aria-label={`${format(cell.date, "yyyy-MM-dd")} 휴가 정보 보기`}
            />
            {isActive ? (
                <HeatmapTooltip
                    entries={cell.entries}
                    date={cell.date}
                    placement={tooltipPlacement}
                />
            ) : null}
        </div>
    );
}

export default function YearlyLeaveHeatmapCard({ year }: { year: number }) {
    const [activeCellKey, setActiveCellKey] = useState<string | null>(null);
    const { weeks, hasEntries } = useLeaveHeatmap(year);
    const {
        annualUsed,
        substituteLeaveUsed,
        officialLeaveUsed,
        defenseLeaveUsed,
    } = useLeaveSummaryByYear(year);

    const metrics = [
        { label: "연차", value: annualUsed },
        { label: "대체휴가", value: substituteLeaveUsed },
        { label: "공가휴가", value: officialLeaveUsed },
        { label: "국방휴가", value: defenseLeaveUsed },
    ];
    const totalWeeks = weeks.length;

    return (
        <div className="mb-4 overflow-visible rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-lg font-semibold text-gray-900">
                            {year}년 휴가 사용
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {metrics.map((metric) => (
                            <div
                                key={metric.label}
                                className="rounded-lg bg-gray-50 px-3 py-2 text-center"
                            >
                                <p className="text-xs font-medium text-gray-500">
                                    {metric.label}
                                </p>
                                <p className="mt-1 text-base font-semibold text-gray-900">
                                    {metric.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {hasEntries ? (
                    <div className="overflow-x-auto pb-1">
                        <div className="inline-flex min-w-max gap-3">
                            <div className="grid grid-rows-7 gap-1 pt-6 text-[11px] text-gray-500">
                                {DAY_LABELS.map((label) => (
                                    <div
                                        key={label}
                                        className={`${CELL_SIZE_CLASS} flex w-auto items-center`}
                                        style={{
                                            transform: "translateY(-1px)",
                                        }}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-1">
                                    {weeks.map((week, index) => (
                                        <div
                                            key={`${year}-month-${index}`}
                                            className={`${CELL_SIZE_CLASS} relative mb-1`}
                                        >
                                            {week.label ? (
                                                <span className="absolute left-0 whitespace-nowrap text-[11px] text-gray-400">
                                                    {week.label}
                                                </span>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-1">
                                    {weeks.map((week, weekIndex) => (
                                        <div
                                            key={`${year}-week-${weekIndex}`}
                                            className="grid grid-rows-7 gap-1"
                                        >
                                            {week.days.map((cell) => (
                                                <HeatmapCell
                                                    key={cell.dateKey}
                                                    cell={cell}
                                                    tooltipPlacement={
                                                        weekIndex < 4
                                                            ? "start"
                                                            : weekIndex >=
                                                                totalWeeks - 4
                                                              ? "end"
                                                              : "center"
                                                    }
                                                    isActive={
                                                        activeCellKey ===
                                                        cell.dateKey
                                                    }
                                                    onOpen={() =>
                                                        setActiveCellKey(
                                                            cell.dateKey,
                                                        )
                                                    }
                                                    onClose={() =>
                                                        setActiveCellKey(
                                                            (currentKey) =>
                                                                currentKey ===
                                                                cell.dateKey
                                                                    ? null
                                                                    : currentKey,
                                                        )
                                                    }
                                                    onToggle={() =>
                                                        setActiveCellKey(
                                                            (currentKey) =>
                                                                currentKey ===
                                                                cell.dateKey
                                                                    ? null
                                                                    : cell.dateKey,
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">
                        이 연도에는 표시할 승인 휴가가 없습니다.
                    </p>
                )}
            </div>
        </div>
    );
}
