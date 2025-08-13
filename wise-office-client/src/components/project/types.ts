export interface ProjectData {
    title: string;
    duration: string;
    status: string;
    manager: string;
    participantsCount: number;
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
