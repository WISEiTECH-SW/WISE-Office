import { useRef, useState } from "react";
import { useRouter } from "next/router";
import SelectProjectMembers from "../../project/SelectProjectMembers";
import ProjectNameWithPeriod from "../../project/ProjectNameWithPeriod";
import Tab from "../../project/Tab";
import { useProjectModal } from "@/hooks/useProjectModal";
type ProjectModalProps = {
    mode: "create" | "update";
    projectId?: number; // update일 때만 필요
    onClose: () => void;
    onCreated?: () => Promise<void> | void; // create일 때만 필요
};

export default function ProjectModal({
    mode,
    projectId,
    onClose,
    onCreated,
}: ProjectModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [tab, setTab] = useState("프로젝트 정보");

    const {
        projectTitle,
        startDate,
        endDate,
        content,
        members,
        companyMembers,
        selectedMembers,
        selectedCompanyMembers,
        manager,
        errors,
        setStartDate,
        setEndDate,
        setSelectedMembers,
        setSelectedCompanyMembers,
        setManager,
        handleSubmit,
        handleContentChange,
        handleProjectTitleChange,
        memberSearchText,
        companyMemberSearchText,
        setMemberSearchText,
        setCompanyMemberSearchText,
        institution,
        setInstitution,
        businessName,
        setBusinessName,
    } = useProjectModal({
        mode,
        projectId,
        router,
        onCreated,
        onClose,
        tab,
        setTab,
    });

    return (
        <div className="Overlay fixed inset-0 bg-opacity-40 flex justify-center items-center z-50 p-6">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl w-full max-w-[64rem] h-[76vh] flex flex-col relative"
            >
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 font-bold text-2xl cursor-pointer"
                    aria-label="Close modal"
                    type="button"
                >
                    x
                </button>

                {/* 스크롤 영역 */}
                <div className="flex-1 overflow-auto p-8">
                    {/* 제목 */}
                    <h2 className="text-center text-2xl font-extrabold mb-6 text-gray-900">
                        {mode === "create" ? "프로젝트 생성" : "프로젝트 수정"}
                    </h2>

                    {/* 탭 */}
                    <div className="w-full flex justify-center mb-6">
                        <div className="w-2/3">
                            <Tab
                                options={["프로젝트 정보", "인원 정보"]}
                                selectedTab={tab}
                                onTabChange={setTab}
                            />
                        </div>
                    </div>

                    {tab === "프로젝트 정보" ? (
                        <ProjectNameWithPeriod
                            projectTitle={projectTitle}
                            institution={institution}
                            setInstitution={setInstitution}
                            businessName={businessName}
                            setBusinessName={setBusinessName}
                            startDate={startDate}
                            endDate={endDate}
                            content={content}
                            setProjectTitle={handleProjectTitleChange}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            setContent={handleContentChange}
                            errors={errors}
                        />
                    ) : (
                        <SelectProjectMembers
                            members={members}
                            companyMembers={companyMembers}
                            selectedMembers={selectedMembers}
                            selectedCompanyMembers={selectedCompanyMembers}
                            manager={manager}
                            memberSearchText={memberSearchText}
                            companyMemberSearchText={companyMemberSearchText}
                            setSelectedMembers={setSelectedMembers}
                            setSelectedCompanyMembers={
                                setSelectedCompanyMembers
                            }
                            setManager={setManager}
                            setMemberSearchText={setMemberSearchText}
                            setCompanyMemberSearchText={
                                setCompanyMemberSearchText
                            }
                            errors={errors}
                        />
                    )}
                </div>

                {/* 하단 고정 버튼 */}
                <div className="p-4 flex justify-center">
                    <button
                        className="px-8 py-3 rounded-full text-white text-lg font-semibold transition bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        onClick={handleSubmit}
                        type="button"
                    >
                        {mode === "create" ? "생성 완료" : "수정 완료"}
                    </button>
                </div>
            </div>
        </div>
    );
}
