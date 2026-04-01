import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import "flatpickr/dist/plugins/monthSelect/style.css";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import { Korean } from "flatpickr/dist/l10n/ko";
import { formatDate } from "@/utils/dateToString";

interface TimePickerProps {
    placeholder: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
}

export default function TimePicker({
    value,
    placeholder,
    error,
    onChange,
}: TimePickerProps) {
    const handleChange = (dates: Date[]) => {
        if (dates.length > 0) {
            const date = dates[0];
            onChange(formatDate(date));
        }
    };

    return (
        <div>
            <Flatpickr
                options={{
                    disableMobile: true,
                    locale: Korean,
                    plugins: [
                        monthSelectPlugin({
                            shorthand: true,
                            dateFormat: "Y-m",
                            altFormat: "Y년 m월",
                            theme: "material_blue",
                        }),
                    ],
                }}
                value={value}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
            />
            <p className="h-2 ml-1 px-1 text-red-500 text-xs mt-1">{error}</p>
        </div>
    );
}
