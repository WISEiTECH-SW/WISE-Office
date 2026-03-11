import { useState } from "react";
import { EditableCell } from "./EditableCell";
import { LabelCell } from "./LabelCell";
import { SectionBody } from "./SectionBody";
import AttendanceModal from "../modal/AttendanceModal";
import ApprovalSeal from "./ApprovalSeal";
import { MinutesCreateRequest } from "@/types/document";
import { ProjectInfo } from "@/types/project";

interface MinuteFormProps {
    projectInfo: ProjectInfo | undefined;
    form: MinutesCreateRequest;
    setForm: React.Dispatch<React.SetStateAction<MinutesCreateRequest>>;
    projectName: string;
}

export default function MinuteForm({
    projectInfo,
    form,
    setForm,
    projectName,
}: MinuteFormProps) {
    const [attendance, setAttendance] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    // 임시 선택 코드로, 교체 예정
    const handleSelectAttendees = (selectedList: string[]) => {
        const selectAttendance = selectedList.join(", ");

        setAttendance(selectAttendance);

        setForm((prev) => ({
            ...prev,
            minutesAttendants: selectAttendance,
            instAttendants: selectAttendance,
        }));

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
                            value={projectName}
                            onChange={() => {}}
                        />
                    </tr>
                    <tr>
                        <LabelCell label="회의주관기관" />
                        <EditableCell
                            placeholder="주관기관을 입력하세요"
                            colSpan={3}
                            value={form.host}
                            onChange={(v) =>
                                setForm((prev) => ({ ...prev, host: v }))
                            }
                        />
                    </tr>
                    <tr className="h-4"></tr>
                </tbody>

                <tbody>
                    <tr>
                        <LabelCell label="회의 날짜" />
                        <td className="border border-black p-2">
                            <input
                                type="date"
                                value={form.minutesDate}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        minutesDate: e.target.value,
                                    }))
                                }
                                className="w-full bg-transparent text-sm text-black border-none focus:outline-none"
                            />
                        </td>
                        <td className="border border-black p-2">
                            <input
                                type="time"
                                value={form.startTime}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        startTime: e.target.value,
                                    }))
                                }
                                className="w-full bg-transparent text-sm text-black border-none focus:outline-none"
                            />
                        </td>
                        <td className="border border-black p-2">
                            <input
                                type="time"
                                value={form.endTime}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        endTime: e.target.value,
                                    }))
                                }
                                className="w-full bg-transparent text-sm text-black border-none focus:outline-none"
                            />
                        </td>
                    </tr>
                    <tr>
                        <LabelCell label="회의 장소" />
                        <EditableCell
                            placeholder="회의 장소를 입력하세요"
                            colSpan={3}
                            value={form.location}
                            onChange={(v) =>
                                setForm((prev) => ({ ...prev, location: v }))
                            }
                        />
                    </tr>
                    <tr>
                        <LabelCell label="회의 목적" />
                        <EditableCell
                            placeholder="회의 목적을 입력하세요"
                            colSpan={3}
                            value={form.purpose}
                            onChange={(v) =>
                                setForm((prev) => ({ ...prev, purpose: v }))
                            }
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
                            value={form.writer}
                            onChange={(v) =>
                                setForm((prev) => ({ ...prev, writer: v }))
                            }
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
                value={form.content}
                onChange={(v) => setForm((prev) => ({ ...prev, content: v }))}
            />

            {isModalOpen && (
                <AttendanceModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={handleSelectAttendees}
                    attendants={projectInfo?.proposalAttendant}
                />
            )}
        </div>
    );
}
