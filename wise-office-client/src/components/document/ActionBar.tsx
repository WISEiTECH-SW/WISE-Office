import { Save, Printer, OctagonX } from "lucide-react";
import Button from "../common/Button";

interface ActionBarProps {
    isNew: boolean;
    lastSaved: boolean;
    savedTime: string | null;
    isValid: boolean;
    saveDoc: () => void;
    exit: () => void;
}

export default function ActionBar({
    isNew,
    lastSaved,
    savedTime,
    isValid,
    saveDoc,
    exit,
}: ActionBarProps) {
    return (
        <div className="print:hidden shrink-0 flex items-center gap-3 px-8 py-3 bg-white/80 backdrop-blur border-b border-blue-100 sticky top-0 z-10">
            <div className="flex items-center gap-1.5 mr-1">
                <span
                    className="w-2 h-2 rounded-full inline-block transition-colors duration-300 animate-pulse"
                    style={{
                        backgroundColor: lastSaved ? "#34d399" : "#fbbf24",
                    }}
                />
                <span className="text-xs text-slate-500">
                    {lastSaved ? "자동 저장 중" : "자동 저장 불가"}
                </span>
            </div>

            <div className="w-px h-5 bg-blue-100 mx-1" />

            <Button
                label={isNew ? "저장" : "수정"}
                onClick={saveDoc}
                variant="primary"
                icon={<Save className="w-4 h-4" />}
                disabled={!isValid}
            />

            <Button
                label="출력"
                onClick={() => window.print()}
                variant="secondary"
                icon={<Printer className="w-4 h-4" />}
            />

            <Button
                label="작성 취소"
                onClick={exit}
                variant="danger"
                icon={<OctagonX className="w-4 h-4" />}
            />

            <span className="ml-auto text-xs text-slate-400">
                {savedTime ? `최근 저장 : ${savedTime}` : "새 문서"}
            </span>
        </div>
    );
}
