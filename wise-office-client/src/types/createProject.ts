// export type ISODate = `${number}-${number}-${number}`;

export interface CreateProject {
    projectTitle: string;
    start: string;
    end: string;
    content: string;
    projectManagerId: number | undefined;
    attendants: number[];
}