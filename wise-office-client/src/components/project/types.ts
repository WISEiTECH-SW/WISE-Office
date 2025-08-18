export interface LogEntry {
    id: number;
    title: string;
    user: string;
    content: string;
    date: string;
    comments: Comment[];
}

export interface Comment {
    id: number;
    user: string;
    content: string;
    date: string;
}
