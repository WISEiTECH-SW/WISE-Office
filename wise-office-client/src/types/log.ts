export interface Log {
    logId: number;
    title: string;
    writer: string;
    createdAt: Date;
    commentCnt: number;
    canmodify: boolean;
}

export interface LogDetail {
    logId: number;
    writer: string;
    createdAt: Date;
    content: string;
    imageUrl: string;
    canModify: boolean;
    title: string;
}

export interface LogInput {
    title: string;
    content: string;
}
