import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Korean } from "flatpickr/dist/l10n/ko.js";
import { useId } from "react";
import { dateToString } from "@/utils/dateToString";

type JoinDateProps = {
    joinDate: string;
    setJoinDate: (v: string) => void;
};

export default function JoinDateField({
    joinDate,
    setJoinDate,
}: JoinDateProps) {
    const inputId = useId();

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3">
            <label
                htmlFor={inputId}
                className="md:col-span-3 font-bold text-gray-800 shrink-0"
            >
                입사일
            </label>

            <div className="md:col-span-9 relative">
                <Flatpickr
                    id={inputId}
                    options={{
                        locale: Korean,
                        disableMobile: true,
                        allowInput: true,
                        maxDate: "today",
                        dateFormat: "Y-m-d",
                        altInput: true,
                        altFormat: "Y-m-d",
                    }}
                    value={joinDate}
                    onChange={(dates) => {
                        if (dates.length) setJoinDate(dateToString(dates[0]));
                    }}
                    onClose={(selectedDates) => {
                        if (selectedDates?.[0])
                            setJoinDate(dateToString(selectedDates[0]));
                    }}
                    className="w-full border border-gray-300 rounded-md pl-10 pr-10 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="입사일을 입력하세요"
                />

                {/* calendar icon */}
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            d="M7 2v3M17 2v3M3 9h18M5 6h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </div>
        </div>
    );
}
