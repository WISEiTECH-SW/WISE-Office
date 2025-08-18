export type ISODate = `${number}-${number}-${number}`;

export interface Project {
    member_pk: number;
    projectTitle: string;
    start: ISODate;
    end: ISODate;
    currentYear: number;
    managerName: string;
    attendant: string[];
}
