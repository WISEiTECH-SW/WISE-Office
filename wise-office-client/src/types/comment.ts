export interface CommentInput {
    content: string;
}

export interface Comment {
    id: number;
    content: string;
    authorName: string;
    writtenAt: string;
    imgUrl: string;
    canmodify: boolean;
}
