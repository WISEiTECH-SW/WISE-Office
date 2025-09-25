type TextProps = {
    text: string;
    setText: (v: string) => void;
    error: string;
    onApply: () => void;
};

export default function LeaveTable({
    text,
    setText,
    error,
    onApply,
}: TextProps) {
    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex flex-col justify-between gap-6">
            <p className="text-xl font-bold">표를 붙여넣기 하세요.</p>
            <div className="w-full h-full">
                <textarea
                    className="w-full h-full border border-gray-300 rounded-md text-xs p-4 resize-none"
                    placeholder="표를 붙여넣기 하세요"
                    rows={5}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <p className="h-4 ml-1 px-1 text-red-500 text-xs">{error}</p>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={onApply}
                    className="px-2 py-1 md:px-4 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center gap-1 cursor-pointer"
                >
                    적용
                </button>
            </div>
        </div>
    );
}
