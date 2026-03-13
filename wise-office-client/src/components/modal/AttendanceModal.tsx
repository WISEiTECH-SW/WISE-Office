import { useEffect, useState } from "react";
import Button from "../common/Button";
import CompanyMemberSelector from "./ProjectModal/CompanyMemberSelector";
import { Member } from "@/types/member";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: string[]) => void;
    attendants: Member[] | undefined;
    selectedNames: string[];
}

export default function AttendanceModal({
    onClose,
    onConfirm,
    attendants,
    selectedNames,
}: ModalProps) {
    // 모달 내부에서 임시로 선택 상태 관리
    useEffect(() => {
        if (!attendants) return;

        const selected = attendants.filter((member) =>
            selectedNames.includes(member.name),
        );

        setSelectedCompanyMembers(selected);
    }, [attendants, selectedNames]);
    // 선택된 인원
    const [selectedCompanyMembers, setSelectedCompanyMembers] = useState<
        Member[]
    >([]);
    const [companyMemberSearchText, setCompanyMemberSearchText] = useState("");
    const handleConfirm = () => {
        const names = selectedCompanyMembers.map((member) => `${member.name}`);
        onConfirm(names);
        // 작성 API에 맞게 이름만 제공
        // const names = selectedCompanyMembers.map(
        //     (member) => `${member.name} ${member.rank}`,
        // );
        // onConfirm(names);
    };
    return (
        <div className="flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[240px]">
                <CompanyMemberSelector
                    isMinute={true}
                    companyMembers={attendants ?? []}
                    selectedCompanyMembers={selectedCompanyMembers}
                    companyMemberSearchText={companyMemberSearchText}
                    setSelectedCompanyMembers={setSelectedCompanyMembers}
                    setCompanyMemberSearchText={setCompanyMemberSearchText}
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
