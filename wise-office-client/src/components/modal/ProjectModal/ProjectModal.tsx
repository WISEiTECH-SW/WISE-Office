import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CreateProject, FormErrors } from "@/types/project";

import { useProjectDetail, useProjectMutation } from "@/hooks/queries";

import ProjectInfoForm from "./info/ProjectInfoForm";
import ProjectMemberForm from "./member/ProjectMemberForm";
import Tab from "@/components/project/Tab";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

import { projectDefaultForm } from "@/constants/defaultForm";
import { projectFormValidate } from "@/utils/formValidation";
import { toastMessage } from "@/lib/common/toastMessage";

type ProjectModalProps = {
    projectId?: number;
    onClose: () => void;
};

export default function ProjectModal({
    projectId,
    onClose,
}: ProjectModalProps) {
    /* ----- useState -----*/
    const [tab, setTab] = useState("프로젝트 정보");
    const [form, setForm] = useState<CreateProject>(projectDefaultForm);
    const [errors, setErrors] = useState<FormErrors>({});

    /* ----- query -----*/
    const { data, isLoading } = useProjectDetail(projectId);
    const { createProject, updateProject, isProjectPending } =
        useProjectMutation();

    /* ----- hook -----*/
    useEffect(() => {
        if (!data) return;

        console.log(data);

        setForm({
            projectTitle: data.projectTitle,
            institution: data.institution,
            businessName: data.businessName,
            start: data.start.toString(),
            end: data.end.toString(),
            content: data.detail,

            projectManagerId: data.managerName.memberId,
            attendants: [
                data.managerName.memberId,
                ...data.attendant.map((member) => member.memberId),
            ],
            proposalAttendants: data.proposalAttendant.map(
                (member) => member.memberId,
            ),
        });
    }, [data]);

    /* ----- func -----*/
    const handleChange = <K extends keyof CreateProject>(
        key: K,
        value: CreateProject[K],
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = () => {
        const newErrors = projectFormValidate(form);

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toastMessage.error("입력 정보를 다시 확인해주세요.");
            return;
        }
        if (projectId) {
            updateProject(
                { data: form, projectId },
                {
                    onSuccess: () => onClose(),
                },
            );
        } else {
            createProject(form, {
                onSuccess: () => onClose(),
            });
        }
    };

    /* ----- ui -----*/
    if (projectId && isLoading && isProjectPending)
        return <LoadingIndicator type="project" />;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
            <div className="flex flex-col p-4 gap-6 items-center max-w-[1100px] max-h-[600px] w-full h-full bg-white rounded-xl shadow-xl overflow-hidden">
                {/* 제목 */}
                <div className="relative w-full">
                    <h2 className="text-center text-2xl font-extrabold">
                        {projectId ? "프로젝트 수정" : "프로젝트 생성"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 w-12 h-12 flex items-center justify-center
                       rounded-full text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* 탭 */}
                <div className="w-2/3 mb-2">
                    <Tab
                        options={["프로젝트 정보", "인원 정보"]}
                        selectedTab={tab}
                        onTabChange={setTab}
                    />
                </div>

                {/* form */}
                <div className="flex-1 min-h-0">
                    {tab === "프로젝트 정보" ? (
                        <ProjectInfoForm
                            form={form}
                            errors={errors}
                            onChange={handleChange}
                        />
                    ) : (
                        <ProjectMemberForm
                            form={form}
                            errors={errors}
                            onChange={handleChange}
                        />
                    )}
                </div>

                {/* 제출 버튼 */}
                <button
                    className="px-8 py-3 rounded-full text-white text-lg font-semibold bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    onClick={handleSubmit}
                    type="button"
                >
                    {projectId ? "수정 완료" : "생성 완료"}
                </button>
            </div>
        </div>
    );

    // const modalRef = useRef<HTMLDivElement>(null);
    // const router = useRouter();
    // const [tab, setTab] = useState("프로젝트 정보");

    // const {
    //     projectTitle,
    //     startDate,
    //     endDate,
    //     content,
    //     members,
    //     companyMembers,
    //     selectedMembers,
    //     selectedCompanyMembers,
    //     manager,
    //     errors,
    //     setStartDate,
    //     setEndDate,
    //     setSelectedMembers,
    //     setSelectedCompanyMembers,
    //     setManager,
    //     handleSubmit,
    //     handleContentChange,
    //     handleProjectTitleChange,
    //     memberSearchText,
    //     companyMemberSearchText,
    //     setMemberSearchText,
    //     setCompanyMemberSearchText,
    //     institution,
    //     setInstitution,
    //     businessName,
    //     setBusinessName,
    // } = useProjectModal({
    //     mode,
    //     projectId,
    //     router,
    //     onCreated,
    //     onClose,
    //     tab,
    //     setTab,
    // });
    // const isLoading = mode === "update" && !projectId;

    // return (
    //     <div className="Overlay fixed inset-0 bg-opacity-40 flex justify-center items-center z-50 p-6">
    //         <div
    //             ref={modalRef}
    //             className="bg-white rounded-xl shadow-xl w-full max-w-[64rem] h-[80vh] flex flex-col"
    //         >
    //             {/* 헤더 모달 이름 + 닫기 버튼 */}
    //             <div className="relative px-8 pt-6 pb-4">
    //                 <button
    //                     onClick={onClose}
    //                     className="absolute top-3 right-3 w-12 h-12 flex items-center justify-center
    //                    rounded-full text-gray-600 hover:bg-gray-100 cursor-pointer"
    //                 >
    //                     <X className="w-5 h-5 text-gray-500" />
    //                 </button>

    //                 <h2 className="text-center text-2xl font-extrabold">
    //                     {mode === "create" ? "프로젝트 생성" : "프로젝트 수정"}
    //                 </h2>
    //             </div>

    //             {/* 스크롤 영역 */}
    //             <div className="flex-1 overflow-auto custom-scroll px-8">
    //                 {isLoading ? (
    //                     <div className="md:px-6">
    //                         <div className="min-h-[60vh] flex items-center justify-center">
    //                             <div className="bg-white rounded-2xl px-10 py-12 flex flex-col items-center gap-4">
    //                                 <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
    //                                 <div className="text-center">
    //                                     <p className="text-base font-semibold text-gray-800">
    //                                         프로젝트 불러오는 중
    //                                     </p>
    //                                     <p className="text-sm text-gray-500 mt-1">
    //                                         프로젝트 정보를 준비하고 있습니다.
    //                                     </p>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ) : (
    //                     <>
    //                         {/* 탭 */}
    //                         <div className="w-full flex justify-center mb-6">
    //                             <div className="w-2/3">
    //                                 <Tab
    //                                     options={["프로젝트 정보", "인원 정보"]}
    //                                     selectedTab={tab}
    //                                     onTabChange={setTab}
    //                                 />
    //                             </div>
    //                         </div>

    //                         {tab === "프로젝트 정보" ? (
    //                             <ProjectNameWithPeriod
    //                                 projectTitle={projectTitle}
    //                                 institution={institution}
    //                                 setInstitution={setInstitution}
    //                                 businessName={businessName}
    //                                 setBusinessName={setBusinessName}
    //                                 startDate={startDate}
    //                                 endDate={endDate}
    //                                 content={content}
    //                                 setProjectTitle={handleProjectTitleChange}
    //                                 setStartDate={setStartDate}
    //                                 setEndDate={setEndDate}
    //                                 setContent={handleContentChange}
    //                                 errors={errors}
    //                             />
    //                         ) : (
    //                             <SelectProjectMembers
    //                                 members={members}
    //                                 companyMembers={companyMembers}
    //                                 selectedMembers={selectedMembers}
    //                                 selectedCompanyMembers={
    //                                     selectedCompanyMembers
    //                                 }
    //                                 manager={manager}
    //                                 memberSearchText={memberSearchText}
    //                                 companyMemberSearchText={
    //                                     companyMemberSearchText
    //                                 }
    //                                 setSelectedMembers={setSelectedMembers}
    //                                 setSelectedCompanyMembers={
    //                                     setSelectedCompanyMembers
    //                                 }
    //                                 setManager={setManager}
    //                                 setMemberSearchText={setMemberSearchText}
    //                                 setCompanyMemberSearchText={
    //                                     setCompanyMemberSearchText
    //                                 }
    //                                 errors={errors}
    //                             />
    //                         )}
    //                     </>
    //                 )}
    //             </div>
    //             {!isLoading && (
    //                 <div className="flex justify-center pb-4">
    //                     <button
    //                         className="px-8 py-3 rounded-full text-white text-lg font-semibold transition bg-blue-600 hover:bg-blue-700 cursor-pointer"
    //                         onClick={handleSubmit}
    //                         type="button"
    //                     >
    //                         {mode === "create" ? "생성 완료" : "수정 완료"}
    //                     </button>
    //                 </div>
    //             )}
    //         </div>
    //     </div>
    // );
}
