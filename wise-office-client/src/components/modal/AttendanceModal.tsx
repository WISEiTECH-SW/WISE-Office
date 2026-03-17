import { useEffect, useState } from "react";
import Button from "../common/Button";
import { Member, MemberWithDisabled } from "@/types/member";
import MinuteAttendanceSelector from "./ProjectModal/MinuteAttendanceSelector";
import { PossibleAttendantsResponse } from "@/types/document";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { attendants: string[]; writer: string }) => void;
    attendants: Member[] | undefined;
    possibleAttendants: PossibleAttendantsResponse[] | undefined;
    selectedNames: string[];
    selectedWriter: string;
}

export default function AttendanceModal({
    onClose,
    onConfirm,
    attendants,
    possibleAttendants,
    selectedNames,
    selectedWriter,
}: ModalProps) {
    // 모달 내부에서 임시로 선택 상태 관리
    useEffect(() => {
        if (!attendants || !possibleAttendants) return;
        const selected = attendants.filter((member) =>
            selectedNames.includes(member.name),
        );

        const possibleMap = new Map(
            possibleAttendants.map((p) => [Number(p.memberId), p.canAttend]),
        );
        setSelectedCompanyMembers(selected);

        const foundWriter = attendants.find(
            (member) => member.name === selectedWriter,
        );

        setWriter(foundWriter ?? null);
        // 선택된 멤버 중, '참석 불가' 판정을 받은 멤버만 필터링
        setSelectedCompanyMembers((prev) =>
            prev.filter(
                (member) => possibleMap.get(Number(member.memberId)) !== false,
            ),
        );

        if (writer && possibleMap.get(Number(writer.memberId)) === false) {
            setWriter(null);
        }
    }, [possibleAttendants]);

    // 참여 가능여부
    const possibleMap = new Map<number, boolean>(
        possibleAttendants?.map((p) => [Number(p.memberId), p.canAttend]),
    );

    const enrichedMembers: MemberWithDisabled[] = (attendants ?? []).map(
        (member) => {
            const canAttend = possibleMap.get(Number(member.memberId));

            return {
                ...member,
                disabled:
                    possibleAttendants !== undefined
                        ? canAttend === false
                        : false,
            };
        },
    );
    console.log("possibleAttendants", possibleAttendants);
    console.log("enrichedMembers", enrichedMembers);
    // 선택된 인원
    const [selectedCompanyMembers, setSelectedCompanyMembers] = useState<
        Member[]
    >([]);
    const [companyMemberSearchText, setCompanyMemberSearchText] = useState("");
    const handleConfirm = () => {
        const names = selectedCompanyMembers.map((member) => `${member.name}`);
        onConfirm({
            attendants: names,
            writer: writer?.name ?? "",
        });
    };
    const [writer, setWriter] = useState<Member | null>(null);

    const handleWriterChange = (member: Member) => {
        setWriter(member);
    };
    return (
        <div className="flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[240px]">
                <MinuteAttendanceSelector
                    companyMembers={enrichedMembers ?? []}
                    selectedCompanyMembers={selectedCompanyMembers}
                    companyMemberSearchText={companyMemberSearchText}
                    setSelectedCompanyMembers={setSelectedCompanyMembers}
                    setCompanyMemberSearchText={setCompanyMemberSearchText}
                    writer={writer}
                    handleWriterChange={handleWriterChange}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        label="확인"
                        variant="primary"
                        onClick={() => handleConfirm()}
                    />
                    <Button
                        label="취소"
                        variant="secondary"
                        onClick={onClose}
                    />
                </div>
            </div>
        </div>
    );
}
