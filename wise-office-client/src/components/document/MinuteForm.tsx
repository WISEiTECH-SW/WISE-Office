import { useState } from "react";
import { EditableCell } from "./EditableCell";
import { LabelCell } from "./LabelCell";
import { SectionBody } from "./SectionBody";
import AttendanceModal from "../modal/AttendanceModal";
import ApprovalSeal from "./ApprovalSeal";

export default function MinuteForm() {
    const [attendance, setAttendance] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const openModal = () => {
        if (attendance) {
            // 선택 되어 있을 경우 initial 데이터 로직
            setIsModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const closeModal = () => setIsModalOpen(false);

    const handleSelectAttendees = (selectedList: string[]) => {
        setAttendance(selectedList.join(", "));
        closeModal();
    };

    return (
        <div className="items-center">
            {/* 결제 란 */}
            <ApprovalSeal />

            {/* 제목 */}
            <div className="text-center font-serif font-bold text-2xl tracking-[12px] mb-1 text-black">
                회 의 록
            </div>
            <div className="w-3/5 mx-auto h-1 bg-gradient-to-r from-black via-white to-black mb-6" />

            {/* 상세사항 */}
            <table className="w-full border-collapse">
                <colgroup>
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "25%" }} />
                </colgroup>
                <tbody>
                    <tr>
                        <LabelCell label="과제명" />
                        <EditableCell
                            placeholder="과제명을 입력하세요"
                            colSpan={3}
                        />
                    </tr>
                    <tr>
                        <LabelCell label="회의주관기관" />
                        <EditableCell
                            placeholder="주관기관을 입력하세요"
                            colSpan={3}
                        />
                    </tr>
                    <tr className="h-4"></tr>
                </tbody>

                <tbody>
                    <tr>
                        <LabelCell label="회의 날짜" />
                        <td className="border border-black px-[10px] py-2 align-middle">
                            <input
                                type="date"
                                className="w-full bg-transparent text-sm text-black border-none focus:outline-none"
                            />
                        </td>
                        <td className="border border-black px-[10px] py-2 align-middle">
                            <input
                                type="time"
                                className="w-full bg-transparent text-sm text-black border-none focus:outline-none"
                            />
                        </td>
                        <td className="border border-black px-[10px] py-2 align-middle">
                            <input
                                type="time"
                                className="w-full bg-transparent text-sm text-black border-none focus:outline-none"
                            />
                        </td>
                    </tr>
                    <tr>
                        <LabelCell label="회의 장소" />
                        <EditableCell
                            placeholder="회의 장소를 입력하세요"
                            colSpan={3}
                        />
                    </tr>
                    <tr>
                        <LabelCell label="회의 목적" />
                        <EditableCell
                            placeholder="회의 목적을 입력하세요"
                            colSpan={3}
                        />
                    </tr>
                    <tr>
                        <LabelCell label="참 석 자" />
                        <td
                            colSpan={3}
                            onClick={openModal}
                            className="border border-black px-[10px] py-2 align-middle text-[13.5px]
                                min-h-[32px] cursor-pointer transition-colors
                                hover:bg-blue-50 active:bg-gray-200    
                                text-left text-gray-700  "
                        >
                            {attendance ? (
                                <span>{attendance}</span>
                            ) : (
                                <span className="text-gray-400 italic">
                                    참석자를 선택하세요
                                </span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <LabelCell label="작 성 자" />
                        <EditableCell
                            placeholder="작성자 이름을 입력하세요"
                            colSpan={3}
                        />
                    </tr>
                    <tr className="h-4"></tr>
                </tbody>
            </table>

            <div className="text-center font-semibold py-2 border border-black text-sm text-black tracking-widest bg-gray-300">
                회 의 내 용
            </div>
            <SectionBody
                placeholder="회의 내용을 입력하세요."
                className="rounded-b min-h-[340px]"
            />

            {isModalOpen && (
                <AttendanceModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={handleSelectAttendees}
                    initialData={[]} // 기존 선택 데이터
                />
            )}
        </div>
    );
}
