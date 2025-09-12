import React, { useEffect, useState } from "react";
import ProjectNameWithPeriod from "@/components/project/ProjectNameWithPeriod";
import SelectProjectMembers from "@/components/project/SelectProjectMembers";
import { CreateProject } from "@/types/createProject";
import { Member } from "@/types/member";
import { getMembers } from "@/services/members";
import { useRef } from "react";
import { postProject } from "@/services/projects";
import { toastMessage } from "@/lib/common/toastMessage";
import { useProjects } from "@/store/useProjects";
import { AxiosError } from "axios";

type ProjectCreateModalProps = {
    onClose: () => void;
    onCreated?: () => Promise<void> | void;
};

export default function ProjectCreateModal({
    onClose,
    onCreated,
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
    const handleProjectTitleChange = (value: string) => {
        if (value.length > 100) {
            toastMessage.error("프로젝트 제목은 100자까지 입력 가능합니다.");
            return;
        }
        setProjectTitle(value);
    };

    const handleContentChange = (value: string) => {
        if (value.length > 500) {
            toastMessage.error("프로젝트 설명은 500자까지 입력 가능합니다.");
            return;
        }
        setContent(value);
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const modal = modalRef.current;
            const flatpickrCalendars = document.querySelectorAll(
                ".flatpickr-calendar"
            );

            if (
                modal &&
                !modal.contains(event.target as Node) &&
                !Array.from(flatpickrCalendars).some((cal) =>
                    cal.contains(event.target as Node)
                )
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

    const [errors, setErrors] = useState({
        projectTitle: "",
        startDate: "",
        endDate: "",
        content: "",
        selectedMembers: "",
        manager: "",
    });

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
        //
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
            if (onCreated) await onCreated();
            toastMessage.success("프로젝트가 등록되었습니다.");
            onClose();
        } catch (error: unknown) {
            const err = error as AxiosError;
            if (err.response?.status === 400) {
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
                <div className="flex flex-row gap-2 flex-grow overflow-hidden">
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
                    className={`mt-4 mx-auto px-8 py-3 rounded-full text-white text-lg font-semibold transition bg-blue-600 hover:bg-blue-700 cursor-pointer`}
                    onClick={handleSubmit}
                    type="button"
                >
                    생성 완료
                </button>
            </div>
        </div>
    );
}
