import { useState } from "react";
import Button from "../common/Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: string[]) => void;
    initialData: string[];
}

export default function AttendanceModal({
    onClose,
    onConfirm,
    initialData,
}: ModalProps) {
    // 모달 내부에서 임시로 선택 상태 관리
    const [tempList, setTempList] = useState<string[]>(initialData);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[400px]">
                <h3 className="text-lg font-bold mb-4">참석자 선택(임시)</h3>

                <div className="min-h-[200px] border p-2 mb-4">
                    {["류정훈", "서주연", "오서현", "최재원"].map((name) => (
                        <label
                            key={name}
                            className="block p-2 hover:bg-gray-50 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={tempList.includes(name)}
                                onChange={(e) => {
                                    if (e.target.checked)
                                        setTempList([...tempList, name]);
                                    else
                                        setTempList(
                                            tempList.filter((n) => n !== name),
                                        );
                                }}
                                className="mr-2"
                            />
                            {name}
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        label="확인"
                        variant="primary"
                        onClick={() => onConfirm(tempList)}
                    />
                    <Button
                        label="취소"
                        variant="secondary"
                        onClick={onClose}
                    />
                </div>
            </div>
        </div>
    );
}
