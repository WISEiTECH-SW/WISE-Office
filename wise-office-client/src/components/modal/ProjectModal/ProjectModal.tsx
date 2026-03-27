import { useRef, useState } from "react";
import { useRouter } from "next/router";
import SelectProjectMembers from "../../project/SelectProjectMembers";
import ProjectNameWithPeriod from "../../project/ProjectNameWithPeriod";
import Tab from "../../project/Tab";
import { useProjectModal } from "@/hooks/useProjectModal";
import { X } from "lucide-react";

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
    const isLoading = mode === "update" && !projectId;

    return (
        <div className="Overlay fixed inset-0 bg-opacity-40 flex justify-center items-center z-50 p-6">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl w-full max-w-[64rem] h-[80vh] flex flex-col"
            >
                {/* 헤더 모달 이름 + 닫기 버튼 */}
                <div className="relative px-8 pt-6 pb-4">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 w-12 h-12 flex items-center justify-center
                       rounded-full text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    <h2 className="text-center text-2xl font-extrabold">
                        {mode === "create" ? "프로젝트 생성" : "프로젝트 수정"}
                    </h2>
                </div>

                {/* 스크롤 영역 */}
                <div className="flex-1 overflow-auto custom-scroll px-8">
                    {isLoading ? (
                        <div className="md:px-6">
                            <div className="min-h-[60vh] flex items-center justify-center">
                                <div className="bg-white rounded-2xl px-10 py-12 flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
                                    <div className="text-center">
                                        <p className="text-base font-semibold text-gray-800">
                                            프로젝트 불러오는 중
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            프로젝트 정보를 준비하고 있습니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
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
                                    selectedCompanyMembers={
                                        selectedCompanyMembers
                                    }
                                    manager={manager}
                                    memberSearchText={memberSearchText}
                                    companyMemberSearchText={
                                        companyMemberSearchText
                                    }
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
                        </>
                    )}
                </div>
                {!isLoading && (
                    <div className="flex justify-center pb-4">
                        <button
                            className="px-8 py-3 rounded-full text-white text-lg font-semibold transition bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            onClick={handleSubmit}
                            type="button"
                        >
                            {mode === "create" ? "생성 완료" : "수정 완료"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
