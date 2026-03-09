export interface Project {
    projectId: number;
    projectTitle: string;
    institution: string;
    businessName: string;
    start: Date;
    end: Date;
    currentYear: number;
    managerName: ProjectAttendant;
    attendant: string[];
    proposalAttendant: string[];
}

export interface ProjectAttendant {
    memberId: number;
    name: string;
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
    proposalAttendant: ProjectAttendant[];
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
