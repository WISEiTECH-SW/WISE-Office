type SignupInputProps = {
    labelName: string;
    id: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    // placeholder: string;
};

export default function SignupInput({
    labelName,
    id,
    type,
    value,
    onChange,
}: SignupInputProps) {
    return (
        <div className="w-full space-y-3 px-4">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
                {labelName}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-400 rounded-md outline-none"
            />
        </div>
    );
}
