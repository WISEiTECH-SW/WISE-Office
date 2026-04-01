import { CreateProject, FormErrors } from "@/types/project";

export const isFormComplete = <T extends object>(form: T): boolean => {
    return Object.values(form).every((value) => {
        if (typeof value === "string") {
            return value.trim() !== "";
        }
        return value !== null && value !== undefined;
    });
};

export const projectFormValidate = (form: CreateProject): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.projectTitle.trim()) {
        newErrors.projectTitle = "프로젝트명을 입력해주세요.";
    }

    if (!form.institution.trim()) {
        newErrors.institution = "전담기관명을 입력해주세요.";
    }

    if (!form.businessName.trim()) {
        newErrors.businessName = "사업명을 입력해주세요.";
    }

    if (!form.start) {
        newErrors.start = "시작일을 선택해주세요.";
    }

    if (!form.end) {
        newErrors.end = "종료일을 선택해주세요.";
    }

    if (form.start && form.end) {
        if (new Date(form.start) > new Date(form.end)) {
            newErrors.end = "종료일은 시작일보다 이후여야 합니다.";
        }
    }

    if (!form.content.trim()) {
        newErrors.content = "프로젝트 설명을 입력해주세요.";
    }

    if (!form.projectLeaderId) {
        newErrors.projectLeaderId = "실무 책임자를 선택해주세요.";
    }

    if (!form.projectManagerId) {
        newErrors.projectManagerId = "과제 책임자를 선택해주세요.";
    }

    if (form.attendants.length === 0) {
        newErrors.attendants = "프로젝트 수행 인원을 선택해주세요.";
    }

    if (form.proposalAttendants.length === 0) {
        newErrors.proposalAttendants = "프로젝트 편성 인원을 선택해주세요.";
    }

    return newErrors;
};
