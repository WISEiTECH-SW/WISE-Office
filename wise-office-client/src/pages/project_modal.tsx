import React, { useEffect, useState } from "react";
import ProjectNameWithPeriod from "@/components/project/ProjectNameWithPeriod";
import SelectProjectMembers from "@/components/project/SelectProjectMembers";
import { CreateProject } from "@/types/createProject";
import { Member } from "@/types/member";
import { getMembers } from "@/services/members";
import { useRef } from "react";
import { postProject } from "@/services/projects";
import { useRouter } from "next/router";
import { toastMessage } from "@/lib/common/toastMessage";
import { useProjects } from "@/store/useProjects";

type ProjectCreateModalProps = {
    onClose: () => void;
};

export default function ProjectCreateModal({
    onClose,
}: ProjectCreateModalProps) {
    const [projectTitle, setProjectTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [content, setContent] = useState("");
    const [searchText, setSearchText] = useState<string>("");
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
    const [manager, setManager] = useState<Member | undefined>();
    const [members, setMembers] = useState<Member[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    useEffect(() => {
        const fetchData = async () => {
            const members = await getMembers();
            setMembers(members);
        };
        fetchData();
    }, []);

    const isFormValid =
        projectTitle.trim() !== "" &&
        startDate !== "" &&
        endDate !== "" &&
        content.trim() !== "" &&
        selectedMembers.length > 0 &&
        manager !== null;

    const handleSubmit = async () => {
        if (!isFormValid) return;

        const start = startDate + "-01";
        const end = endDate + "-01";
        const projectManagerId = manager?.memberId;
        const attendants = selectedMembers.map((member) => member.memberId);
        const projectData: CreateProject = {
            projectTitle,
            start,
            end,
            content,
            projectManagerId,
            attendants,
        };

        try {
            const newProject = await postProject(projectData);
            useProjects.getState().addProject(newProject);
            useProjects.getState().fetchProjects();
            toastMessage.success("프로젝트가 등록되었습니다.");
            onClose();
        } catch (error: any) {
            if (error.response?.status === 400) {
                toastMessage.error("기간 또는 PM 설정을 확인해주세요.");
            } else {
                toastMessage.error(
                    "프로젝트 등록 중 오류가 발생했습니다. 다시 시도해주세요."
                );
            }
        }
    };

    return (
        <div className="Overlay fixed inset-0 bg-opacity-40 flex justify-center items-center z-50 p-6">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl p-8 w-full max-w-[64rem] max-h-[90vh] flex flex-col relative"
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

                {/* 제목 */}
                <h2 className="text-center text-2xl font-extrabold mb-6 text-gray-900 col-span-full">
                    프로젝트 생성
                </h2>

                {/* 좌우 영역: flex-grow 해서 남은 높이 전부 차지 */}
                <div className="flex flex-row gap-8 flex-grow overflow-hidden">
                    {/* 왼쪽 영역 */}
                    <ProjectNameWithPeriod
                        projectTitle={projectTitle}
                        startDate={startDate}
                        endDate={endDate}
                        content={content}
                        setProjectTitle={setProjectTitle}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setContent={setContent}
                    />

                    {/* 오른쪽 영역 */}
                    <SelectProjectMembers
                        members={members}
                        searchText={searchText}
                        selectedMembers={selectedMembers}
                        manager={manager}
                        setSearchText={setSearchText}
                        setSelectedMembers={setSelectedMembers}
                        setManager={setManager}
                    />
                </div>

                {/* 생성 완료 버튼 */}
                <button
                    className={`mt-4 mx-auto px-8 py-3 rounded-full text-white text-lg font-semibold transition ${
                        isFormValid
                            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    type="button"
                >
                    생성 완료
                </button>
            </div>
        </div>
    );
}
