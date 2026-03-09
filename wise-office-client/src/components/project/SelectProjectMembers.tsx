import { Member } from "@/types/member";

interface SelectProjectMembersProps {
    members: Member[];
    companyMembers: Member[];
    selectedMembers: Member[];
    selectedCompanyMembers: Member[];
    manager: Member | undefined;
    memberSearchText: string;
    companyMemberSearchText: string;
    setSelectedMembers: React.Dispatch<React.SetStateAction<Member[]>>;
    setSelectedCompanyMembers: React.Dispatch<React.SetStateAction<Member[]>>;
    setManager: React.Dispatch<React.SetStateAction<Member | undefined>>;
    setMemberSearchText: React.Dispatch<React.SetStateAction<string>>;
    setCompanyMemberSearchText: React.Dispatch<React.SetStateAction<string>>;
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
    companyMembers,

    selectedMembers,
    selectedCompanyMembers,

    manager,

    memberSearchText,
    companyMemberSearchText,
    setSelectedMembers,
    setSelectedCompanyMembers,
    setManager,
    setMemberSearchText,
    setCompanyMemberSearchText,
    errors,
}: SelectProjectMembersProps) {
    const filteredMembers = members.filter(
        (m) =>
            m.name.includes(memberSearchText) ||
            m.rank.includes(memberSearchText),
    );
    const filteredCompanyMembers = companyMembers.filter(
        (m) =>
            m.name.includes(companyMemberSearchText) ||
            m.rank.includes(companyMemberSearchText),
    );
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

    const handleManagerChange = (member: Member) => {
        setManager(member);
    };

    return (
        <div className="grid grid-cols-2 gap-10 w-full">
            {/* 수행 인원 */}
            <div className="grid grid-cols-2 gap-4 pr-6 border-r border-gray-300">
                {/* 수행인원 - 좌측 */}
                <div>
                    <h3 className="font-semibold mb-2">수행 인원</h3>

                    {/* 선택된 수행 인원 */}
                    {selectedMembers.length > 0 && (
                        <div className="border border-gray-300 rounded-md h-40 mb-3 p-2 overflow-y-auto">
                            {selectedMembers.map((member) => (
                                <div
                                    key={member.memberId}
                                    className="flex justify-between"
                                >
                                    <span>
                                        {member.name} {member.rank}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
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
                            <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3 mx-1 shadow-inner">
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

                    <div className="border border-gray-300 rounded-md max-h-52 overflow-y-auto">
                        {filteredMembers.map((member) => (
                            <label
                                key={member.memberId}
                                className="flex items-center gap-2 px-3 py-2"
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

            {/* 편성 인원 */}
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
                        onChange={(e) =>
                            setCompanyMemberSearchText(e.target.value)
                        }
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
        </div>
    );
}
