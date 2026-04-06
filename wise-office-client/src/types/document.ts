export interface Minutes {
    minutes_pk: number;
    project_pk: number;
}

export interface MinutesItem {
    minutesId: number;
    title: string;
    minutesAt: string;
}

export type MinutesList = MinutesItem[];

export interface MinutesInfo {
    minutesId: number;
    title: string;
    host: string;
    minutesDate: string;
    startTime: string;
    endTime: string;
    location: string;
    purpose: string;
    minutesAttendants: MinutesAttendantsInfo[];
    instAttendants: string;
    writer: MinutesAttendantsInfo;
    content: string;
}

export interface MinutesCreateRequest {
    host: string;
    location: string;
    purpose: string;
    minutesDate: string;
    startTime: string;
    endTime: string;
    minutesAttendants: number[];
    instAttendants: string;
    writer: number;
    content: string;
}

export interface MinutesListResponse {
    minutesId: number;
    title: string;
    minutesAt: string;
    writer: string;
    purpose: string;
}

export interface MinutesDetail {
    minutesId: number;
    approveId: number | null;
    title: string;
    host: string;
    minutesDate: string;
    startTime: string;
    endTime: string;
    location: string;
    purpose: string;
    minutesAttendants: MinutesAttendantsInfo[];
    instAttendants: string;
    writer: MinutesAttendantsInfo;
    content: string;
    writtenAt: string;
}

export interface MinutesAttendantsInfo {
    memberId: number;
    name: string;
    rank: string;
}

export interface Approval {
    approve_pk: number;
    meeting_pk: number;
    report_no: string;
    write_date: Date;
    department: string;
    submit_date: Date;
}

export type DocType = "minute" | "approve" | "trip";

export interface ApproveCreateResonse {
    approveId: number;
    minutesId: number;
    approveNo: string;
    writtenAt: string;
    writer: string;
    submitAt: string;
    businessName: string;
    title: string;
    institution: string;
    minutesAt: string;
    minutesPurpose: string;
}

export interface ApprovalDetailResponse {
    approveId: number;
    minutesId: number; // 해당 품의서를 작성한 회의록 번호
    approveNo: string; // 문서번호
    writtenAt: string; // 작성일자
    writer: string; //품의자
    submitAt: string; // 접수일자
    businessName: string; // 사업명
    title: string; // 과제명
    institution: string; // 전담기관
    minutesAt: string; // 회의일자
    minutesPurpose: string; // 회의목적
}

export interface ApproveUpdateResponse {
    approveId: number;
    reportNo: string; // 수정된 품의서 번호 (문서번호)
    writer: string; // 작성자
}

export interface ApproveUpdateRequest {
    reportNo: string;
    writer: string;
}

export type ApproveList = ApproveListResponse[];

export interface ApproveListResponse {
    approveId: number;
    title: string; // 문서번호
    submitDate: string; // 접수일자
    writer: string; // 작성자
}

export interface PossibleAttendantsResponse {
    memberId: number;
    name: string;
    rank: string;
    canAttend: boolean;
}

export interface MinutesSummary {
    minutesId: string;
    minutesDate: string;
    startTime: string;
    endTime: string;
    minutesTitle: string;
    attendants: string;
}

export interface ApprovalSummary {
    approveId: number;
    approveTitle: string;
}

export interface DocumentPair {
    minutes: MinutesSummary;
    approve: ApprovalSummary | null;
}

export interface MonthlyDocument {
    projectId: number;
    title: string;
    pair: DocumentPair[];
}
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
