import { useOverviewStore } from "@/store/useOverviewStore";
import { Calendar1, Folder } from "lucide-react";

export default function MenuToggle() {
    const { optionIndex, setOptionIndex } = useOverviewStore();

    const options = [
        { name: "프로젝트", icon: <Folder size={18} strokeWidth={1.5} /> },
        { name: "월간", icon: <Calendar1 size={18} strokeWidth={1.5} /> },
    ];

    return (
        <div className="relative grid grid-cols-2 rounded-lg border border-gray-200 text-sm overflow-hidden">
            <div
                className="absolute top-0 left-0 h-full w-1/2 bg-gray-200 rounded-lg transition-transform duration-300 ease-out"
                style={{ transform: `translateX(${optionIndex * 100}%)` }}
            />

            {options.map((option, index) => (
                <button
                    key={option.name}
                    onClick={() => setOptionIndex(index)}
                    className={`relative flex gap-2 items-center justify-center px-4 py-1.5 z-10 cursor-pointer ${
                        optionIndex === index
                            ? "text-text-primary font-semibold"
                            : "text-text-secondary"
                    }`}
                >
                    {option.icon}
                    {option.name}
                </button>
            ))}
        </div>
    );
}
