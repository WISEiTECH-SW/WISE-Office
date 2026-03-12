export interface Minutes {
    minutes_pk: number;
    project_pk: number;
    title: string;
    host: string;
    minutes_date: Date;
    location: string;
    purpose: string;
    writer: string;
    meeting_content: string;
    inst_attendants: string[];
    start_time: string;
    end_time: string;
    minutes_number: string;
}

export interface MinutesCreateRequest {
    host: string;
    location: string;
    purpose: string;
    minutesDate: string;
    startTime: string;
    endTime: string;
    minutesAttendants: string;
    instAttendants: string;
    writer: string;
    content: string;
}

export interface MinutesListResponse {
    minutesId: number;
    title: string;
    minutesAt: string;
}

export interface MinutesDetail {
    minutesId: number;
    host: string;
    minutesDate: string;
    startTime: string;
    endTime: string;
    location: string;
    purpose: string;
    minutesAttendants: string;
    instAttendants: string;
    writer: string;
    meetingContent: string;
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

export interface ApproveDetailResponse {
    approveId: number;
    minutesId: number; // 해당 품의서를 작성한 회의록 번호
    approveNo: string; // 문서번호
    writtenAt: string; // 작성일자
    writer: string; //품의자
    submitAt: string; // 접수일자
    businessName: string; // 접수일자
    title: string; // 과제명
    institution: string; // 전담기관
    minutesAt: string; // 회의일자
    minutesPurpose: string; // 회의목적
}
