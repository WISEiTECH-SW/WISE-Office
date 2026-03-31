import { Member } from "@/types/member";
import React from "react";

interface Props {
    members: Member[];
    selectedMembers: Member[];
    manager: Member | undefined;
    memberSearchText: string;
    setSelectedMembers: React.Dispatch<React.SetStateAction<Member[]>>;
    setManager: React.Dispatch<React.SetStateAction<Member | undefined>>;
    setMemberSearchText: React.Dispatch<React.SetStateAction<string>>;
    errors: {
        selectedMembers: string;
        manager: string;
    };
}

export default function MemberSelector({
    members,
    selectedMembers,
    manager,
    memberSearchText,
    setSelectedMembers,
    setManager,
    setMemberSearchText,
    errors,
}: Props) {
    const filteredMembers = members.filter(
        (m) =>
            m.name.includes(memberSearchText) ||
            m.rank.includes(memberSearchText),
    );
    const handleManagerChange = (member: Member) => {
        setManager(member);
    };
    // 수행 인원 선택
    const toggleMember = (member: Member) => {
        const exists = selectedMembers.find(
            (m) => m.memberId === member.memberId,
        );

        if (exists) {
            setSelectedMembers(
                selectedMembers.filter((m) => m.memberId !== member.memberId),
            );

            if (manager?.memberId === member.memberId) {
                setManager(undefined);
            }
        } else {
            setSelectedMembers([...selectedMembers, member]);
        }
    };
    return (
        <div className="grid grid-cols-2 gap-4 pr-6 border-r border-gray-300">
            {/* 수행인원 - 좌측 */}
            <div>
                <h3 className="font-semibold mb-2">수행 인원 리스트</h3>

                {/* 선택된 수행 인원 */}
                <div className="border border-gray-300 rounded-md h-40 mb-3 p-2 overflow-y-auto">
                    {selectedMembers.map((member) => (
                        <div
                            key={member.memberId}
                            className="flex justify-between items-center group px-1 py-1  hover:bg-blue-50"
                        >
                            <span>
                                {member.name} {member.rank}
                            </span>
                            {/* hover 시 나타나는 삭제 버튼 */}
                            <button
                                onClick={() => toggleMember(member)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <p className="h-2 ml-1 text-red-500 text-xs mt-1">
                    {errors.selectedMembers}{" "}
                </p>
                {/* 책임자 선택 */}
                <div className="mt-5">
                    <label className="block mx-1 mb-2 font-semibold text-gray-700 text-sm">
                        책임자 선택
                    </label>
                    {selectedMembers.length === 0 ? (
                        <p className="text-sm font-light text-gray-500 italic">
                            참여 인력을 먼저 선택해주세요.
                        </p>
                    ) : (
                        <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3 mx-1 shadow-inner custom-scroll">
                            {selectedMembers.map((member) => (
                                <label
                                    key={member.memberId}
                                    className="flex items-center gap-3 mb-2 cursor-pointer text-gray-800"
                                >
                                    <input
                                        type="radio"
                                        name="manager"
                                        checked={
                                            manager?.memberId ===
                                            member.memberId
                                        }
                                        onChange={() =>
                                            handleManagerChange(member)
                                        }
                                        className="cursor-pointer"
                                    />
                                    <span>
                                        {member.name} {member.rank}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                    {/* 에러 메시지: 관리자 */}
                    <p className="h-2 ml-1 text-red-500 text-xs mt-1">
                        {errors.manager}
                    </p>
                </div>
            </div>

            {/* 수행인원 - 우측 */}
            <div>
                <h3 className="font-semibold mb-2">수행 인원 검색</h3>
                <input
                    type="text"
                    placeholder="이름 및 직급 검색"
                    value={memberSearchText}
                    onChange={(e) => setMemberSearchText(e.target.value)}
                    className="border border-gray-300 w-full px-3 py-2 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="border border-gray-300 rounded-md max-h-52 overflow-y-auto custom-scroll">
                    {filteredMembers.map((member) => (
                        <label
                            key={member.memberId}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedMembers.some(
                                    (m) => m.memberId === member.memberId,
                                )}
                                onChange={() => toggleMember(member)}
                            />
                            {member.name} {member.rank}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
