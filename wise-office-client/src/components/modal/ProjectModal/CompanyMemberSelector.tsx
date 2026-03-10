import { Member } from "@/types/member";
import React from "react";

interface Props {
    companyMembers: Member[];
    selectedCompanyMembers: Member[];
    companyMemberSearchText: string;
    setSelectedCompanyMembers: React.Dispatch<React.SetStateAction<Member[]>>;
    setCompanyMemberSearchText: React.Dispatch<React.SetStateAction<string>>;
}

export default function CompanyMemberSelector({
    companyMembers,
    selectedCompanyMembers,
    companyMemberSearchText,
    setSelectedCompanyMembers,
    setCompanyMemberSearchText,
}: Props) {
    const filteredCompanyMembers = companyMembers.filter(
        (m) =>
            m.name.includes(companyMemberSearchText) ||
            m.rank.includes(companyMemberSearchText),
    );
    // 편성 인원 선택
    const toggleCompanyMember = (member: Member) => {
        const exists = selectedCompanyMembers.find(
            (m) => m.memberId === member.memberId,
        );

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
        <div className="grid grid-cols-2 gap-4">
            {/* 편성인원 - 좌측 */}
            <div>
                <h3 className="font-semibold mb-2">편성 인원</h3>

                {/* 선택된 편성 인원 */}
                <div className="border border-gray-300 rounded-md h-40 mb-3 p-2 overflow-y-auto">
                    {selectedCompanyMembers.map((member) => (
                        <div key={member.memberId}>
                            {member.name} {member.rank}
                        </div>
                    ))}
                </div>
            </div>

            {/* 편성인원 - 우측 */}
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
                    {filteredCompanyMembers.map((member) => (
                        <label
                            key={member.memberId}
                            className="flex items-center gap-2 px-3 py-2"
                        >
                            <input
                                type="checkbox"
                                checked={selectedCompanyMembers.some(
                                    (m) => m.memberId === member.memberId,
                                )}
                                onChange={() => toggleCompanyMember(member)}
                            />
                            {member.name} {member.rank}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
