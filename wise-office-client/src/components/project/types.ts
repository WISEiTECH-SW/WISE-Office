export interface ProjectData {
    title: string;
    manager: string;
    participantsCount: number;
    start: Date;
    end: Date;
}

export interface Comment {
    id: number;
    user: string;
    content: string;
    date: string;
}

export interface Log {
    id: number;
    title: string;
    user: string;
    content: string;
    date: string;
    comments: Comment[];
}
