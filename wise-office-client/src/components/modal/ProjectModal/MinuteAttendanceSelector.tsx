import { PossibleAttendantsResponse } from "@/types/document";
import React from "react";

interface Props {
    companyMembers: PossibleAttendantsResponse[];
    selectedCompanyMembers: PossibleAttendantsResponse[];
    companyMemberSearchText: string;
    setSelectedCompanyMembers: React.Dispatch<
        React.SetStateAction<PossibleAttendantsResponse[]>
    >;
    setCompanyMemberSearchText: React.Dispatch<React.SetStateAction<string>>;
    writer: PossibleAttendantsResponse | null;
    handleWriterChange: (member: PossibleAttendantsResponse) => void;
}

export default function MinuteAttendanceSelector({
    companyMembers,
    selectedCompanyMembers,
    companyMemberSearchText,
    setSelectedCompanyMembers,
    setCompanyMemberSearchText,
    writer,
    handleWriterChange,
}: Props) {
    const filteredCompanyMembers = companyMembers.filter(
        (m) =>
            m.name.includes(companyMemberSearchText) ||
            m.rank.includes(companyMemberSearchText),
    );
    // 편성 인원 선택
    const toggleCompanyMember = (member: PossibleAttendantsResponse) => {
        const exists = selectedCompanyMembers.find(
            (m) => m.memberId === member.memberId,
        );

        if (!member.canAttend && !exists) return;
        if (exists) {
            setSelectedCompanyMembers(
                selectedCompanyMembers.filter(
                    (m) => m.memberId !== member.memberId,
                ),
            );
        } else {
            setSelectedCompanyMembers([...selectedCompanyMembers, member]);
        }
    };

    return (
        <div className="gap-4">
            {/* 편성인원 */}
            <div>
                <h3 className="font-semibold mb-2">편성 인원 검색</h3>
                <input
                    type="text"
                    placeholder="이름 및 직급 검색"
                    value={companyMemberSearchText}
                    onChange={(e) => setCompanyMemberSearchText(e.target.value)}
                    className="border border-gray-300 w-full px-3 py-2 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="border border-gray-300 rounded-md max-h-52 overflow-y-auto">
                    {filteredCompanyMembers.map((member) => {
                        const isSelected = selectedCompanyMembers.some(
                            (m) => m.memberId === member.memberId,
                        );
                        return (
                            <label
                                key={member.memberId}
                                className={`flex items-center gap-2 px-3 py-2 ${
                                    !member.canAttend && !isSelected
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer hover:bg-gray-50"
                                }`}
                                onClick={(e) => {
                                    if (!member.canAttend) e.preventDefault();
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCompanyMembers.some(
                                        (m) => m.memberId === member.memberId,
                                    )}
                                    onChange={() => toggleCompanyMember(member)}
                                    disabled={!member.canAttend && !isSelected}
                                />
                                {member.name} {member.rank}
                            </label>
                        );
                    })}
                </div>
            </div>
            {/* 작성자 선택 */}
            <div className="mt-5">
                <label className="block mx-1 mb-2 font-semibold text-gray-700 text-sm">
                    작성자 선택
                </label>
                {selectedCompanyMembers.length === 0 ? (
                    <p className="text-sm font-light text-gray-500 italic">
                        참석자를 먼저 선택해주세요.
                    </p>
                ) : (
                    <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3 mx-1 shadow-inner">
                        {selectedCompanyMembers.map((member) => (
                            <label
                                key={member.memberId}
                                className="flex items-center gap-3 mb-2 cursor-pointer text-gray-800"
                            >
                                <input
                                    type="radio"
                                    name="manager"
                                    checked={
                                        writer?.memberId === member.memberId
                                    }
                                    onChange={() => handleWriterChange(member)}
                                    className="cursor-pointer"
                                />
                                <span>
                                    {member.name} {member.rank}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
