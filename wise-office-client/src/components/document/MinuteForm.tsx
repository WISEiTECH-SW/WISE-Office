import { EditableCell } from "./EditableCell";
import { LabelCell } from "./LabelCell";
import { SectionBody } from "./SectionBody";
import ApprovalSeal from "./ApprovalSeal";
import {
    MinutesCreateRequest,
    PossibleAttendantsResponse,
} from "@/types/document";
import { toastMessage } from "@/lib/common/toastMessage";
import { useMemo } from "react";

interface MinuteFormProps {
    projectName: string;
    form: MinutesCreateRequest;
    setForm: React.Dispatch<React.SetStateAction<MinutesCreateRequest>>;
    openAttendanceModal: () => void;
    attendantsNameAndRank: string;
    possibleAttendants?: PossibleAttendantsResponse[];
}

export default function MinuteForm({
    projectName,
    form,
    setForm,
    openAttendanceModal,
    attendantsNameAndRank,
    possibleAttendants,
}: MinuteFormProps) {
    const writerInfo = possibleAttendants?.find(
        (m) => m.memberId === form.writer,
    );

    // 시간 비교용
    const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };
    // 30분 단위 시간 옵션 생성
    const timeOptions = useMemo(() => {
        const options: string[] = [];
        for (let i = 7; i < 22; i++) {
            for (let j = 0; j < 60; j += 30) {
                options.push(
                    `${i.toString().padStart(2, "0")}:${j
                        .toString()
                        .padStart(2, "0")}`,
                );
            }
        }
        return options;
    }, []);

    // 회의 시작 유효성 검사
    const handleTimeChange = (newString: string, isStartTime: boolean) => {
        if (!newString) {
            toastMessage.info("올바른 시간을 선택해 주세요.");
            return;
        }
        const startNum = isStartTime
            ? timeToMinutes(newString)
            : timeToMinutes(form.startTime);
        const endNum = isStartTime
            ? timeToMinutes(form.endTime)
            : timeToMinutes(newString);

        if (isStartTime) {
            if (startNum >= endNum) {
                // 시작이 종료보다 늦어지면 종료 시간 자동 조정 (한 시간 뒤)
                const nextTimeIdx = timeOptions.indexOf(newString) + 2;
                const autoEnd =
                    timeOptions[nextTimeIdx] || timeOptions[nextTimeIdx - 2];

                setForm((prev) => ({
                    ...prev,
                    startTime: newString,
                    endTime: autoEnd,
                }));
            } else {
                setForm((prev) => ({ ...prev, startTime: newString }));
            }
        } else {
            if (endNum <= startNum) {
                toastMessage.error(
                    "종료 시간은 시작 시간보다 이후여야 합니다.",
                );
            } else {
                setForm((prev) => ({ ...prev, endTime: newString }));
            }
        }
    };

    return (
        <div className="bg-white w-full max-w-[720px] min-h-[1020px] h-full px-[80px] pt-[80px] pb-[120px] flex flex-col">
            {/* 결제 란 */}
            <ApprovalSeal />

            {/* 제목 */}
            <div className="text-center font-bold text-2xl tracking-[12px] mb-1 text-black">
                회 의 록
            </div>
            <div className="w-1/2 mx-auto h-1 bg-gradient-to-r from-black via-white to-black mb-6" />

            {/* 상세사항 */}
            <table className="w-full border-collapse">
                <colgroup>
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "20%" }} />
                </colgroup>
                <tbody>
                    <tr>
                        <LabelCell label="과제명" />
                        <EditableCell
                            placeholder="과제명을 입력하세요"
                            colSpan={4}
                            value={projectName}
                            onChange={() => {}}
                        />
                    </tr>
                    <tr>
                        <LabelCell label="회의주관기관" />
                        <EditableCell
                            placeholder="주관기관을 입력하세요"
                            colSpan={4}
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
                        <LabelCell label="회의 일시" />
                        {/* 날짜 */}
                        <td colSpan={2} className="border border-black p-0">
                            <input
                                type="date"
                                value={form.minutesDate}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        minutesDate: e.target.value,
                                    }))
                                }
                                className="w-full h-full p-2 text-sm text-center outline-none cursor-pointer hover:bg-gray-50 bg-transparent screen-only"
                            />
                            {/* 출력용 */}
                            <div className="hidden print:block w-full h-full p-2 text-sm text-center">
                                {form.minutesDate}
                            </div>
                        </td>
                        {/* 시간 */}
                        <td colSpan={2} className="border border-black p-0">
                            <div className="flex items-center gap-2 px-2 h-full">
                                {/* 시작 시간 */}
                                <div className="flex flex-col flex-1">
                                    <span className="text-[11px] text-gray-500 text-center screen-only">
                                        시작
                                    </span>
                                    <select
                                        value={form.startTime || ""}
                                        onChange={(e) =>
                                            handleTimeChange(
                                                e.target.value,
                                                true,
                                            )
                                        }
                                        className="w-full py-2 text-sm text-center border border-gray-300 rounded-md 
                                                    bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 custom-scroll screen-only"
                                    >
                                        <option value="" disabled>
                                            --:--
                                        </option>
                                        {timeOptions.map((t) => (
                                            <option
                                                key={`start-${t}`}
                                                value={t}
                                            >
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <span className="text-gray-400 mt-4 screen-only">
                                    ~
                                </span>

                                {/* 종료 시간 */}
                                <div className="flex flex-col flex-1">
                                    <span className="text-[11px] text-gray-500 text-center screen-only">
                                        종료
                                    </span>
                                    <select
                                        value={form.endTime || ""}
                                        onChange={(e) =>
                                            handleTimeChange(
                                                e.target.value,
                                                false,
                                            )
                                        }
                                        className="w-full py-2 text-sm text-center border border-gray-300 rounded-md 
                                                    bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 custom-scroll screen-only"
                                    >
                                        <option value="" disabled>
                                            --:--
                                        </option>
                                        {timeOptions.map((t) => (
                                            <option key={`end-${t}`} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 출력 UI */}
                            <div className="hidden print:flex items-center justify-center h-full text-sm">
                                {form.startTime && form.endTime
                                    ? `${form.startTime} ~ ${form.endTime}`
                                    : ""}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <LabelCell label="회의 장소" />
                        <EditableCell
                            placeholder="회의 장소를 입력하세요"
                            colSpan={4}
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
                            colSpan={4}
                            value={form.purpose}
                            onChange={(v) =>
                                setForm((prev) => ({ ...prev, purpose: v }))
                            }
                        />
                    </tr>
                    <tr>
                        <LabelCell label="참 석 자" />
                        <td
                            colSpan={4}
                            className="border border-black px-[10px] py-2 text-[13.5px]"
                        >
                            <div className="flex flex-col gap-2">
                                {/* 내부 참석자 */}
                                <div
                                    onClick={openAttendanceModal}
                                    className="cursor-pointer hover:bg-blue-50 px-1 py-[2px]"
                                >
                                    {form.minutesAttendants.length > 0 ? (
                                        <span>
                                            <span className="text-[13.5px]">
                                                위세아이텍:
                                            </span>{" "}
                                            {attendantsNameAndRank.replace(
                                                /[A-Za-z]/g,
                                                "",
                                            )}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 italic">
                                            <span className="font-medium text-gray-600">
                                                위세아이텍:
                                            </span>{" "}
                                            우측 리스트에서 참석자를 선택하세요
                                        </span>
                                    )}
                                </div>
                                {/* 외부기관 참석자 */}
                                <textarea
                                    placeholder="기관명: 참석자1, 참석자2,... 와 같이 외부기관 참석자를 입력해 주세요."
                                    value={form.instAttendants}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            instAttendants: e.target.value,
                                        }))
                                    }
                                    className="w-full outline-none text-[13.5px] placeholder-gray-400 screen-only"
                                />
                                <div className="hidden print:block w-full h-full px-1 text-[13.5px]">
                                    {form.instAttendants}
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <LabelCell label="작 성 자" />
                        <td
                            colSpan={4}
                            className="border border-black px-[10px] py-2 text-[13.5px]"
                        >
                            {form.writer ? (
                                <span>
                                    {writerInfo
                                        ? `${writerInfo.name.replace(/[A-Za-z]/g, "")} ${writerInfo.rank}`
                                        : ""}
                                </span>
                            ) : (
                                <span className="text-gray-400 italic">
                                    우측 리스트에서 작성자를 선택하세요
                                </span>
                            )}
                        </td>
                    </tr>
                    <tr className="h-4"></tr>
                </tbody>
            </table>

            <div className="text-center font-semibold py-2 border border-black text-sm text-black tracking-widest bg-gray-300">
                회 의 내 용
            </div>
            <SectionBody
                placeholder="회의 내용을 입력하세요."
                className="rounded-b min-h-[400px]"
                value={form.content}
                onChange={(v) => setForm((prev) => ({ ...prev, content: v }))}
            />
        </div>
    );
}
