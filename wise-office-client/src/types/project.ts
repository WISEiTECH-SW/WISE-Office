export interface Project {
    projectId: number;
    projectTitle: string;
    start: Date;
    end: Date;
    currentYear: number;
    managerName: string;
    attendant: string[];
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
    institute: string;
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
    start: string;
    end: string;
    content: string;
    projectManagerId: number | undefined;
    attendants: number[];
}
