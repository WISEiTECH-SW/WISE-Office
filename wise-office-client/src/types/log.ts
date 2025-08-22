export interface Log {
    logId: number;
    title: string;
    writer: string;
    createdAt: string;
    commentCnt: number;
    canmodify: boolean;
}

export interface LogDetail {
    logId: number;
    writer: string;
    createdAt: string;
    content: string;
    imageUrl: string;
    canModify: boolean;
    title: string;
}

export interface LogInput {
    title: string;
    content: string;
}
