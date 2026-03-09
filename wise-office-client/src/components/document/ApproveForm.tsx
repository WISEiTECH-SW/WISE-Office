import ApprovalSeal from "./ApprovalSeal";
import { EditableCell } from "./EditableCell";
import { LabelCell } from "./LabelCell";
import { SectionBody } from "./SectionBody";

export default function ApproveForm() {
    return (
        <div>
            {/* 결제 란 */}
            <ApprovalSeal />

            {/* 제목 */}
            <div className="text-center font-serif font-bold text-2xl tracking-[12px] mb-1 text-black">
                품 의 서 (임시)
            </div>
            <div className="w-3/5 mx-auto h-1 bg-gradient-to-r from-black via-white to-black mb-6" />

            <table className="w-full border-collapse">
                <colgroup>
                    <col style={{ width: "18%" }} />
                    <col style={{ width: "32%" }} />
                    <col style={{ width: "18%" }} />
                    <col style={{ width: "32%" }} />
                </colgroup>
                <tbody>
                    <tr>
                        <LabelCell label="제 목" />
                        <EditableCell
                            placeholder="품의 제목을 입력하세요"
                            colSpan={3}
                        />
                    </tr>
                    <tr>
                        <LabelCell label="기 안 자" />
                        <EditableCell placeholder="기안자" />
                        <LabelCell label="기 안 일" />
                        <td className="border border-[#d1cbbf] px-[10px] py-2 align-middle">
                            <input
                                type="date"
                                className="w-full bg-transparent text-[13.5px] text-[#3a3430] border-none focus:outline-none"
                            />
                        </td>
                    </tr>
                    <tr>
                        <LabelCell label="소 속" />
                        <EditableCell placeholder="부서명" />
                        <LabelCell label="시 행 일" />
                        <td className="border border-[#d1cbbf] px-[10px] py-2 align-middle">
                            <input
                                type="date"
                                className="w-full bg-transparent text-[13.5px] text-[#3a3430] border-none focus:outline-none"
                            />
                        </td>
                    </tr>
                    <tr>
                        <LabelCell label="관 련 근 거<" />
                        <EditableCell
                            placeholder="관련 규정 또는 근거를 입력하세요"
                            colSpan={3}
                        />
                    </tr>
                    <tr>
                        <LabelCell label="예 산" />
                        <EditableCell placeholder="금액" />
                        <LabelCell label="예산 항목" />
                        <EditableCell placeholder="예산 항목" />
                    </tr>
                </tbody>
            </table>

            {/* 결재란 */}
            <div className="text-center font-semibold py-1.5 border border-[#d1cbbf] text-[12px] text-[#4e4640] tracking-widest bg-[#f5f4f0] mt-5">
                결 재 란
            </div>
            <table className="w-full border-collapse">
                <tbody>
                    <tr>
                        {["담 당", "팀 장", "부 서 장", "대 표"].map(
                            (label) => (
                                <LabelCell key={label} label={label} />
                            ),
                        )}
                    </tr>
                    <tr>
                        {[0, 1, 2, 3].map((i) => (
                            <EditableCell key={i} placeholder="서명" />
                        ))}
                    </tr>
                </tbody>
            </table>

            <div className="text-center font-semibold py-2 border border-black text-sm text-black tracking-widest bg-gray-300">
                품 의 내 용
            </div>
            <SectionBody
                placeholder="품의 내용을 구체적으로 입력하세요."
                className="rounded-b min-h-[280px]"
            />
        </div>
    );
}
