export type ISODate = `${number}-${number}-${number}`;

export interface Project {
    projectId: number;
    projectTitle: string;
    start: ISODate;
    end: ISODate;
    currentYear: number;
    managerName: string;
    attendant: string[];
}

export interface ProjectAttendant {
    memberId: number;
    name: string;
    imgUrl: string;
}

export interface ProjectInfo {
    projectId: number;
    projectTitle: string;
    detail: string;
    start: Date;
    end: Date;
    currentYear: number;
    managerName: ProjectAttendant;
    attendant: ProjectAttendant[];
    canModify: boolean;
}

export interface CreateProject {
    title: string;
    content: string;
}
