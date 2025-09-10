type SignupSelectProps = {
    id: string;
    labelName: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
};

export default function SignupSelect({
    id,
    labelName,
    options,
    value,
    onChange,
}: SignupSelectProps) {
    return (
        <div className="w-full space-y-3 px-4">
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {labelName}
            </label>
            <select
                id={id}
                name={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full max-w-sm px-3 py-2 mt-1 border border-gray-400 rounded-md outline-none cursor-pointer"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}
