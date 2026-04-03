import { useEffect, useState } from "react";
import { PossibleAttendantsResponse } from "@/types/document";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import MinuteAttendanceSelector from "./MinuteAttendanceSelector";
import Button from "@/components/ui/Button";

interface ModalProps {
    selectedIds: number[];
    selectedWriterId: number;
    possibleAttendants?: PossibleAttendantsResponse[];
    isLoading: boolean;
    onClose: () => void;
    onConfirm: (data: { attendants: number[]; writer: number }) => void;
    setAttendantsNameAndRank: React.Dispatch<React.SetStateAction<string>>;
}

export default function AttendanceModal({
    selectedIds,
    selectedWriterId,
    possibleAttendants,
    isLoading,
    onClose,
    onConfirm,
    setAttendantsNameAndRank,
}: ModalProps) {
    // 선택된 인원
    const [selectedCompanyMembers, setSelectedCompanyMembers] = useState<
        PossibleAttendantsResponse[]
    >([]);
    const [companyMemberSearchText, setCompanyMemberSearchText] = useState("");
    const [writer, setWriter] = useState<PossibleAttendantsResponse | null>(
        null,
    );

    // 참여 가능여부
    const enrichedMembers: PossibleAttendantsResponse[] = (
        possibleAttendants ?? []
    ).map((member) => {
        const isAlreadySelected = selectedCompanyMembers.some(
            (m) => m.memberId === member.memberId,
        );

        return {
            ...member,
            disabled: member.canAttend === false && !isAlreadySelected,
        };
    });

    /* ------ hook ----- */
    useEffect(() => {
        if (!possibleAttendants) return;

        const initialSelected = possibleAttendants.filter((member) =>
            selectedIds.includes(member.memberId),
        );

        const foundWriter = possibleAttendants.find(
            (member) => member.memberId === selectedWriterId,
        );

        setSelectedCompanyMembers(initialSelected);
        setWriter(foundWriter ?? null);
    }, [possibleAttendants, selectedIds, selectedWriterId]);

    // 참석자 작성자 동기화
    useEffect(() => {
        if (!writer) return;

        const stillExists = selectedCompanyMembers.some(
            (member) => member.memberId === writer.memberId,
        );

        if (!stillExists) {
            setWriter(null);
        }
    }, [selectedCompanyMembers, writer]);

    /* ------ func ----- */
    const handleConfirm = () => {
        if (!writer) return;
        // 회의록 기입용 사내 참석자 이름 + 직급
        const names = selectedCompanyMembers.map(
            (member) => `${member.name} ${member.rank}`,
        );
        setAttendantsNameAndRank(names.join(" " + ", "));
        onConfirm({
            attendants: selectedCompanyMembers.map((m) => m.memberId),
            writer: writer?.memberId ?? 0,
        });
    };

    const handleWriterChange = (member: PossibleAttendantsResponse) => {
        setWriter(member);
    };

    /* ------ ui ----- */
    if (isLoading) return <LoadingIndicator type="minutes" />;

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[400px]">
                {!possibleAttendants ? (
                    <div className="text-sm text-gray-500 text-center py-10">
                        회의 날짜를 먼저 선택해 주세요.
                    </div>
                ) : (
                    <>
                        <MinuteAttendanceSelector
                            companyMembers={enrichedMembers ?? []}
                            selectedCompanyMembers={selectedCompanyMembers}
                            companyMemberSearchText={companyMemberSearchText}
                            setSelectedCompanyMembers={
                                setSelectedCompanyMembers
                            }
                            setCompanyMemberSearchText={
                                setCompanyMemberSearchText
                            }
                            writer={writer}
                            handleWriterChange={handleWriterChange}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                label="확인"
                                variant="primary"
                                onClick={() => handleConfirm()}
                                disabled={!writer}
                            />
                            <Button
                                label="취소"
                                variant="secondary"
                                onClick={onClose}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
