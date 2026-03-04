import { getMembers } from "@/services/members";
import {
    getProjectById,
    postProject,
    updateProject,
} from "@/services/projects";
import { Member } from "@/types/member";
import { ProjectInfo } from "@/types/project";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { toastMessage } from "@/lib/common/toastMessage";
import { useProjects } from "@/store/useProjects";
import { CreateProject } from "@/types/createProject";
import SelectProjectMembers from "../project/SelectProjectMembers";
import ProjectNameWithPeriod from "../project/ProjectNameWithPeriod";
type ProjectModalProps = {
    mode: "create" | "update";
    projectId?: number; // update일 때만 필요
    setProjectInfo?: React.Dispatch<React.SetStateAction<ProjectInfo | null>>;
    onClose: () => void;
    onCreated?: () => Promise<void> | void; // create일 때만 필요
};

export default function ProjectModal({
    mode,
    projectId,
    setProjectInfo,
    onClose,
    onCreated,
}: ProjectModalProps) {
    const [projectTitle, setProjectTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [content, setContent] = useState("");
    const [searchText, setSearchText] = useState<string>("");
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
    const [manager, setManager] = useState<Member | undefined>();
    const [members, setMembers] = useState<Member[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const handleProjectTitleChange = (value: string) => {
        if (value.length > 100) {
            toastMessage.error("프로젝트 제목은 100자까지 입력 가능합니다.");
            return;
        }
        setProjectTitle(value);
    };
    const [errors, setErrors] = useState({
        projectTitle: "",
        startDate: "",
        endDate: "",
        content: "",
        selectedMembers: "",
        manager: "",
    });
    useEffect(() => {
        const fetchMembers = async () => {
            const members = await getMembers();
            setMembers(members);

            if (mode === "update" && projectId && router.isReady) {
                const project_old = await getProjectById(projectId);

                setProjectTitle(project_old.projectTitle);
                setContent(project_old.detail);
                setStartDate(String(project_old.start).slice(0, 7));
                setEndDate(String(project_old.end).slice(0, 7));

                setManager(
                    members.find(
                        (member) =>
                            member.memberId ===
                            project_old.managerName.memberId,
                    ),
                );

                const selected = members.filter((member) =>
                    project_old.attendant.some(
                        (att) => att.memberId === member.memberId,
                    ),
                );

                setSelectedMembers(selected);
            }
        };

        if (!router.isReady) return;
        fetchMembers();
    }, [mode, projectId, router.isReady]);
    const validateForm = () => {
        let valid = true;
        const newErrors = {
            projectTitle: "",
            startDate: "",
            endDate: "",
            content: "",
            selectedMembers: "",
            manager: "",
        };

        if (projectTitle.trim() === "") {
            newErrors.projectTitle = "프로젝트명을 입력해주세요.";
            valid = false;
        } else if (projectTitle.length > 100) {
            newErrors.projectTitle =
                "프로젝트 제목은 100자까지 입력 가능합니다.";
            valid = false;
        }

        if (startDate === "") {
            newErrors.startDate = "시작 날짜를 선택해주세요.";
            valid = false;
        }

        if (endDate === "") {
            newErrors.endDate = "종료 날짜를 선택해주세요.";
            valid = false;
        }

        if (startDate && endDate && startDate > endDate) {
            newErrors.endDate = "시작일 이후로 선택해주세요.";
            valid = false;
        }

        if (content.trim() === "") {
            newErrors.content = "프로젝트 설명을 입력해주세요.";
            valid = false;
        } else if (content.length > 500) {
            newErrors.content = "프로젝트 설명은 500자까지 입력 가능합니다.";
            valid = false;
        }

        if (selectedMembers.length === 0) {
            newErrors.selectedMembers = "프로젝트 참여 인원을 선택해주세요.";
            valid = false;
        }

        if (!manager) {
            newErrors.manager = "프로젝트 관리자를 선택해주세요.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };
    const handleSubmit = async () => {
        if (!validateForm()) return;

        const start = startDate + "-01";
        const [year, month] = endDate.split("-").map(Number);
        const lastDay = new Date(year, month, 0).getDate();
        const end = `${endDate}-${lastDay.toString().padStart(2, "0")}`;

        const projectData: CreateProject = {
            projectTitle,
            start,
            end,
            content,
            projectManagerId: manager?.memberId,
            attendants: selectedMembers.map((m) => m.memberId),
        };

        try {
            if (mode === "create") {
                const newProject = await postProject(projectData);
                useProjects.getState().addProject(newProject);
                if (onCreated) await onCreated();
                toastMessage.success("프로젝트가 등록되었습니다.");
            } else {
                const updated = await updateProject(projectData, projectId!);
                if (setProjectInfo) setProjectInfo(updated);
                toastMessage.success("프로젝트가 수정되었습니다.");
            }

            onClose();
        } catch (err) {
            toastMessage.error(
                mode === "create"
                    ? "프로젝트 등록에 실패했습니다."
                    : "프로젝트 수정에 실패했습니다.",
            );
        }
    };
    const handleContentChange = (value: string) => {
        if (value.length > 500) {
            toastMessage.error("프로젝트 설명은 500자까지 입력 가능합니다.");
            return;
        }
        setContent(value);
    };
    return (
        <div className="Overlay fixed inset-0 bg-opacity-40 flex justify-center items-center z-50 p-6">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl p-8 w-full max-w-[64rem] max-h-[76vh] flex flex-col relative"
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
                    {mode === "create" ? "프로젝트 생성" : "프로젝트 수정"}
                </h2>

                {/* 좌우 영역: flex-grow 해서 남은 높이 전부 차지 */}
                <div className="flex flex-col md:flex-row gap-8 flex-grow overflow-hidden">
                    {/* 왼쪽 영역 */}
                    <ProjectNameWithPeriod
                        projectTitle={projectTitle}
                        startDate={startDate}
                        endDate={endDate}
                        content={content}
                        setProjectTitle={handleProjectTitleChange}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setContent={handleContentChange}
                        errors={errors}
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
                        errors={errors}
                    />
                </div>

                {/* 생성 완료 버튼 */}
                <button
                    className={`mt-2 mx-auto px-8 py-3 rounded-full text-white text-lg font-semibold transition bg-blue-600 hover:bg-blue-700 cursor-pointer`}
                    onClick={handleSubmit}
                    type="button"
                >
                    {mode === "create" ? "생성 완료" : "수정 완료"}
                </button>
            </div>
        </div>
    );
}
