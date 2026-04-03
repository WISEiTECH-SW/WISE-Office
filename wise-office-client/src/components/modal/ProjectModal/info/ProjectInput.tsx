import { MAX_LENGTH } from "@/constants/config";

interface ProjectIputProps {
    label: string;
    value: string;
    placeholder: string;
    maxLength: (typeof MAX_LENGTH)[keyof typeof MAX_LENGTH];
    error?: string;
    onChange: (value: string) => void;
}

export default function ProjectInput({
    label,
    value,
    placeholder,
    maxLength,
    error,
    onChange,
}: ProjectIputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= maxLength) onChange(value);
    };

    return (
        <div>
            <label className="block font-semibold mb-4 text-gray-700 text-sm">
                {label}
            </label>
            {maxLength === 50 ? (
                <textarea
                    value={value}
                    onChange={handleChange}
                    rows={2}
                    className="border border-gray-300 rounded-md p-2 w-full resize-none
                            overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500
                            custom-scroll cursor-text [&::-webkit-scrollbar-thumb]:cursor-default 
                            [&::-webkit-scrollbar-thumb:hover]:cursor-default"
                    placeholder={placeholder}
                />
            ) : (
                <textarea
                    value={value}
                    maxLength={maxLength}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 w-full h-[200px] resize-none 
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            custom-scroll cursor-text [&::-webkit-scrollbar-thumb]:cursor-default 
                            [&::-webkit-scrollbar-thumb:hover]:cursor-default"
                    placeholder={placeholder}
                />
            )}

            <div className="flex items-center justify-between mt-1 mx-1">
                <p className="text-red-500 text-xs">{error}</p>
                <span className="text-xs text-gray-500">
                    {value.length}/{maxLength}
                </span>
            </div>
        </div>
    );
}
