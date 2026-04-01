import { Member } from "@/types/member";
import { useEffect, useState } from "react";

interface ProjectMemberSelectorProps {
    members: Member[];
    initialMembers: number[];
    attendant: "수행" | "편성";
    managerId?: number;
    attendatnError?: string;
    managerError?: string;
    onSelectedMemberChange: (value: number[]) => void;
    setManagerId: (value: number | undefined) => void;
}

export default function ProjectMemberSelector({
    members,
    initialMembers,
    attendant,
    managerId,
    attendatnError,
    managerError,
    onSelectedMemberChange,
    setManagerId,
}: ProjectMemberSelectorProps) {
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
    const [memberSearchText, setMemberSearchText] = useState<string>("");

    useEffect(() => {
        setSelectedMembers(
            members.filter((member) =>
                initialMembers.includes(member.memberId),
            ),
        );
    }, [initialMembers]);

    const filteredMembers = members.filter(
        (m) =>
            m.name.includes(memberSearchText) ||
            m.rank.includes(memberSearchText),
    );

    const toggleMember = (member: Member) => {
        const exists = selectedMembers.find(
            (m) => m.memberId === member.memberId,
        );

        let updatedMembers: Member[];

        if (exists) {
            updatedMembers = selectedMembers.filter(
                (m) => m.memberId !== member.memberId,
            );

            if (managerId === member.memberId) {
                setManagerId(undefined);
            }
        } else {
            updatedMembers = [...selectedMembers, member];
        }

        setSelectedMembers(updatedMembers);
        const changedMemberId = updatedMembers.map((m) => m.memberId);

        console.log(changedMemberId);
        onSelectedMemberChange(changedMemberId);
    };

    return (
        <div className="grid grid-cols-2 gap-6 h-full">
            {/* 좌측 */}
            <div className="flex flex-col justify-between h-full">
                <div>
                    <h3 className="font-semibold mb-4">{`${attendant} 인원 리스트`}</h3>
                    {/* 선택된 수행 인원 */}
                    <div className="border border-gray-300 rounded-md h-40 mb-3 p-2 overflow-y-auto">
                        {selectedMembers.map((member) => (
                            <div
                                key={member.memberId}
                                className="flex justify-between items-center group px-1 py-1 hover:bg-blue-50"
                            >
                                <span>
                                    {member.name} {member.rank}
                                </span>

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
                        {attendatnError}
                    </p>
                </div>

                {/* 책임자 선택 */}
                <div>
                    <label className="block mb-4 font-semibold text-gray-700 text-sm">
                        {attendant === "수행"
                            ? "실무 책임자 (PL) 선택"
                            : "과제 책임자 (PM) 선택"}
                    </label>
                    {selectedMembers.length === 0 ? (
                        <p className="text-sm font-light text-gray-500 italic">
                            참여 인력을 먼저 선택해주세요.
                        </p>
                    ) : (
                        <div className="max-h-28 border border-gray-300 rounded-md p-2 shadow-inner overflow-y-auto custom-scroll">
                            {selectedMembers.map((member) => (
                                <label
                                    key={member.memberId}
                                    className="flex items-center gap-3 mb-2 cursor-pointer text-gray-800"
                                >
                                    <input
                                        type="radio"
                                        name={`${attendant}-manager`}
                                        checked={managerId === member.memberId}
                                        onChange={() =>
                                            setManagerId(member.memberId)
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
                    <p className="h-2 ml-1 text-red-500 text-xs mt-1">
                        {managerError}
                    </p>
                </div>
            </div>

            {/* 우측 */}
            <div>
                <h3 className="font-semibold mb-4">{`${attendant} 인원 검색`}</h3>
                <input
                    type="text"
                    placeholder="이름 및 직급 검색"
                    value={memberSearchText}
                    onChange={(e) => setMemberSearchText(e.target.value)}
                    className="border border-gray-300 w-full p-2 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto custom-scroll">
                    {filteredMembers.map((member) => (
                        <label
                            key={member.memberId}
                            className="flex items-center gap-2 p-2 cursor-pointer"
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
