import { useState, useEffect } from "react";
import Button from "../ui/Button";

interface DateTimeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: {
        minutesDate: string;
        startTime: string;
        endTime: string;
    }) => void;
    initialDate?: string;
    initialStartTime?: string;
    initialEndTime?: string;
}

export default function DateTimeModal({
    isOpen,
    onClose,
    onConfirm,
    initialDate,
    initialStartTime,
    initialEndTime,
}: DateTimeModalProps) {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    useEffect(() => {
        if (isOpen) {
            setDate(initialDate ?? "");
            setStartTime(initialStartTime ?? "");
            setEndTime(initialEndTime ?? "");
        }
    }, [isOpen, initialDate, initialStartTime, initialEndTime]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative bg-white p-6 rounded w-80 space-y-4">
                <h2 className="text-lg font-semibold">회의 일정 입력</h2>

                <div>
                    <label className="text-sm">날짜</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>

                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-sm">시작</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="text-sm">종료</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        label="확인"
                        onClick={() => {
                            onConfirm({
                                minutesDate: date,
                                startTime,
                                endTime,
                            });
                            onClose();
                        }}
                        variant="primary"
                    />

                    <Button
                        label="취소"
                        onClick={onClose}
                        variant="secondary"
                    />
                </div>
            </div>
        </div>
    );
}
