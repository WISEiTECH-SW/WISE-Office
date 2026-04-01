interface ProjectIputProps {
    label: string;
    value: string;
    placeholder: string;
    maxLength: 50 | 500;
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
    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const value = e.target.value;
        if (value.length <= maxLength) onChange(value);
    };

    return (
        <div className="flex flex-col gap-4">
            <label className="block font-semibold text-gray-700 text-sm">
                {label}
            </label>
            {maxLength === 50 ? (
                <div className="relative">
                    <input
                        type="text"
                        value={value}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md p-2 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={placeholder}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                        {value.length || 0}/{maxLength}
                    </span>
                </div>
            ) : (
                <div className="h-44">
                    <textarea
                        value={value}
                        maxLength={maxLength}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md p-2 w-full h-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={placeholder}
                    />
                    <span className="mr-2 flex justify-end text-xs text-gray-500">
                        {value.length}/{maxLength}
                    </span>
                </div>
            )}

            <p className="h-2 ml-1 px-1 text-red-500 text-xs mt-1">{error}</p>
        </div>
    );
}
