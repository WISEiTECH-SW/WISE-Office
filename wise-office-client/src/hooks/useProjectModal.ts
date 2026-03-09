import { useEffect, useState } from "react";
import { Member } from "@/types/member";
import { getMembers } from "@/services/members";
import {
    getProjectById,
    postProject,
    updateProject,
} from "@/services/projects";
import { toastMessage } from "@/lib/common/toastMessage";
import { ProjectInfo } from "@/types/project";
import { CreateProject } from "@/types/createProject";
import { useProjects } from "@/store/useProjects";
type UseProjectModalProps = {
    mode: "create" | "update";
    projectId?: number;
    router: any;
    onCreated?: () => Promise<void> | void;
    onClose: () => void;
    setProjectInfo?: React.Dispatch<React.SetStateAction<ProjectInfo | null>>;
};
export function useProjectModal({
    mode,
    projectId,
    router,
    onCreated,
    onClose,
    setProjectInfo,
}: UseProjectModalProps) {
    const [projectTitle, setProjectTitle] = useState("");
    const [instituion, setInstitution] = useState(""); // 전담기관
    const [businessTitle, setBusinessTitle] = useState(""); // 사업명
    const [companyMembers, setCompanyMembers] = useState<Member[]>([]); // 회사 전체 인력
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [content, setContent] = useState("");

    const [members, setMembers] = useState<Member[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
    const [selectedCompanyMembers, setSelectedCompanyMembers] = useState<
        Member[]
    >([]);
    const [manager, setManager] = useState<Member | undefined>();

    const [errors, setErrors] = useState({
        projectTitle: "",
        startDate: "",
        endDate: "",
        content: "",
        selectedMembers: "",
        manager: "",
    });

    const [memberSearchText, setMemberSearchText] = useState("");
    const [companyMemberSearchText, setCompanyMemberSearchText] = useState("");

    useEffect(() => {
        const fetchMembers = async () => {
            const groupedmembers = await getMembers();
            setMembers(groupedmembers.members);
            setCompanyMembers(groupedmembers.companyMembers);

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

                const selectedMembers = members.filter((member) =>
                    project_old.attendant.some(
                        (att) => att.memberId === member.memberId,
                    ),
                );
                const selectedCompanyMembers = companyMembers.filter((member) =>
                    project_old.proposalAttendant.some(
                        (att) => att.memberId === member.memberId,
                    ),
                );
                setSelectedMembers(selectedMembers);
                setSelectedCompanyMembers(selectedCompanyMembers);
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
            proposalAttendants: selectedCompanyMembers.map((m) => m.memberId),
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
    const handleProjectTitleChange = (value: string) => {
        if (value.length > 100) {
            toastMessage.error("프로젝트 제목은 100자까지 입력 가능합니다.");
            return;
        }
        setProjectTitle(value);
    };
    return {
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
    };
}
