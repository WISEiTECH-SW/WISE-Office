import Tooltip from "../../ui/Tootip";

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
        <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-4">
                <p className="text-xl font-bold">표를 붙여넣기 하세요.</p>
                <Tooltip message="입력하신 내용은 저장되지 않습니다" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                    인트라넷 &gt; 휴가신청 화면에서 <br />
                    입사일 이후 모든 휴가기간을 드래그하여 복사/붙여넣기 하세요.
                </p>
                <textarea
                    className="relative w-full h-full border border-gray-300 rounded-md text-sm p-4 resize-none"
                    placeholder="여기에 붙여넣기 하세요"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <div className="flex justify-between">
                <p className="h-4 ml-1 px-1 text-red-500 text-xs">{error}</p>
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
