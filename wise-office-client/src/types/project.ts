import { Member } from "./member";

export interface Project {
    projectId: number;
    projectTitle: string;
    institution: string;
    businessName: string;
    start: Date;
    end: Date;
    currentYear: number;
    managerName: string;
    attendant: string[];
    proposalAttendant: string[];
}

export interface ProjectAttendant {
    memberId: number;
    name: string;
    rank: string;
    imageUrl: string;
}

export interface ProjectInfo {
    projectId: number;
    projectTitle: string;
    detail: string;
    start: Date;
    end: Date;
    institution: string;
    businessName: string;
    currentYear: number;
    managerName: ProjectAttendant;
    attendant: ProjectAttendant[];
    proposalAttendant: Member[];
    canModify: boolean;
    attending: boolean;
}

export interface CreateProject {
    projectTitle: string;
    institution: string;
    businessName: string;
    start: string;
    end: string;
    content: string;
    projectManagerId: number | undefined;
    attendants: number[];
    proposalAttendants: number[];
}

export interface ProjectItem {
    projectId: number;
    projectTitle: string;
}

export interface ProjectGroupByYear {
    year: number;
    projects: ProjectItem[];
}

export type DocumentType = "log" | "minute" | "approve" | "trip";

export type SelectedDocument = { type: DocumentType; id: number | null };

export type DeleteModalType =
    | "project"
    | "log"
    | "comment"
    | "minute"
    | "approve";

export type DeleteModalState = { type: DeleteModalType; id: number } | null;
