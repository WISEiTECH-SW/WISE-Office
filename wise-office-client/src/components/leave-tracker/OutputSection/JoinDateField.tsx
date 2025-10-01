import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Korean } from "flatpickr/dist/l10n/ko.js";
import { dateToString } from "@/utils/dateToString";

type SignupInputProps = {
    labelName: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    page: string;
};

export default function JoinDateField({
    labelName,
    id,
    value,
    onChange,
    page,
}: SignupInputProps) {
    return (
        <div className="w-full">
            {page !== "leave" && (
                <label
                    htmlFor={id}
                    className="block text-gray-700 font-semibold mb-2"
                >
                    {labelName}
                </label>
            )}
            <div className="relative mt-1">
                <Flatpickr
                    options={{
                        locale: Korean,
                        disableMobile: true,
                        allowInput: true,
                        maxDate: "today",
                        dateFormat: "Y-m-d",
                        altInput: true,
                        altFormat: "Y-m-d",
                    }}
                    value={value}
                    onChange={(dates) => {
                        if (dates.length) onChange(dateToString(dates[0]));
                    }}
                    onClose={(selectedDates) => {
                        if (selectedDates?.[0])
                            onChange(dateToString(selectedDates[0]));
                    }}
                    className="w-full pl-10 px-3 py-2 border border-gray-400 rounded-md outline-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="입사일을 선택하세요"
                />

                {/* calendar icon */}
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
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
