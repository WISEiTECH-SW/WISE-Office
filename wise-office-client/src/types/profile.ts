import { Project } from "@/types/project";
export interface Profile {
    memberId: number;
    rank: string;
    team: string;
    name: string;
    imageUrl: string;
    projectList: Project[];
}

export interface ProfileRequest{
    team: string;
    rank: string;
}