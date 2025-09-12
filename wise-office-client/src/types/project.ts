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

export interface PageInfo {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface PageParams {
    currentPage: number;
    offset: number;
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
    currentYear: number;
    managerName: ProjectAttendant;
    attendant: ProjectAttendant[];
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
