import { Member } from "@/types/member";

interface SelectProjectMembersProps {
    members: Member[];
    searchText: string;
    selectedMembers: Member[];
    manager: Member | undefined;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    setSelectedMembers: React.Dispatch<React.SetStateAction<Member[]>>;
    setManager: React.Dispatch<React.SetStateAction<Member | undefined>>;
    errors: {
        projectTitle: string;
        startDate: string;
        endDate: string;
        content: string;
        selectedMembers: string;
        manager: string;
    };
}

export default function SelectProjectMembers({
    members,
    searchText,
    selectedMembers,
    manager,
    setSearchText,
    setSelectedMembers,
    setManager,
    errors,
}: SelectProjectMembersProps) {
    const filteredMembers = members.filter(
        (m) =>
            m.name.includes(searchText) ||
            (typeof m.rank === "string" &&
                m.rank.toLowerCase().includes(searchText.toLowerCase()))
    );

    const toggleMember = (member: Member) => {
        if (selectedMembers.find((m) => m.memberId === member.memberId)) {
            setSelectedMembers(
                selectedMembers.filter((m) => m.memberId !== member.memberId)
            );
            if (manager?.memberId === member.memberId) {
                setManager(undefined);
            }
        } else {
            setSelectedMembers([...selectedMembers, member]);
        }
    };

    const handleManagerChange = (member: Member) => {
        setManager(member);
    };

    return (
        <div className="grid grid-cols-2 gap-5 basis-4/5 overflow-hidden pl-2">
            {/* 왼쪽 열 */}
            <div className="flex flex-col overflow-y-auto">
                {/* 검색창 */}
                <label className="block ml-1 mb-2 font-semibold text-gray-700 text-sm">
                    검색
                </label>
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="검색..."
                    className="border border-gray-300 rounded-md mx-1 px-3 py-2 w-full-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* 선택된 멤버 카드 */}
                {selectedMembers.length > 0 && (
                    <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md ml-1 p-3 max-h-[120px] overflow-y-auto shadow-inner mb-2">
                        {selectedMembers.map((member) => (
                            <div
                                key={member.memberId}
                                className="flex items-center justify-between gap-2 bg-blue-100 px-3 py-1 rounded text-sm whitespace-nowrap flex-shrink-0"
                                style={{ minWidth: "80px" }}
                            >
                                <span>{member.name}</span>
                                <button
                                    onClick={() => toggleMember(member)}
                                    className="text-red-600 font-bold hover:text-red-800 cursor-pointer"
                                    aria-label={`Remove ${member.name}`}
                                    type="button"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* 에러 메시지: 참여 인력 */}
                {errors.selectedMembers && (
                    <p className="text-red-500 text-xs ml-1 mt-1">
                        {errors.selectedMembers}
                    </p>
                )}

                {/* 책임자 선택 */}
                <div className="mt-5">
                    <label className="block ml-1 mb-2 font-semibold text-gray-700 text-sm">
                        책임자 선택
                    </label>
                    {selectedMembers.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                            참여 인력을 먼저 선택해주세요.
                        </p>
                    ) : (
                        <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md ml-1 p-3 shadow-inner">
                            {selectedMembers.map((member) => (
                                <label
                                    key={member.memberId}
                                    className="flex items-center gap-3 mb-2 cursor-pointer text-gray-800"
                                >
                                    <input
                                        type="radio"
                                        name="manager"
                                        checked={
                                            manager?.memberId === member.memberId
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
                    {errors.manager && (
                        <p className="text-red-500 text-xs ml-1 mt-1">
                            {errors.manager}
                        </p>
                    )}
                </div>
            </div>

            {/* 오른쪽 열: 참여 인력 목록 */}
            <div className="flex flex-col overflow-y-auto">
                <label className="block mx-1 mb-2 font-semibold text-gray-700 text-sm">
                    참여 인력
                </label>
                <div className="border border-gray-300 mx-1 rounded-md max-h-[70vh] overflow-y-auto shadow-sm">
                    {filteredMembers.length === 0 ? (
                        <p className="text-center text-sm text-gray-500 py-3">
                            검색 결과 없음
                        </p>
                    ) : (
                        filteredMembers.map((member) => {
                            const isSelected = selectedMembers.find(
                                (m) => m.memberId === member.memberId
                            );
                            return (
                                <div
                                    key={member.memberId}
                                    className={`flex justify-between px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                                        isSelected
                                            ? "bg-blue-100 font-semibold"
                                            : ""
                                    }`}
                                    onClick={() => toggleMember(member)}
                                >
                                    <span>
                                        {member.name} {member.rank}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
