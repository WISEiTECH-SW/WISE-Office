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
    writtenAt: string;
}

export interface MinutesDetail {
    minutesId: number;
    host: string;
    minutesDate: string;
    startTime: string;
    endTime: string;
    location: string;
    purpose: string;
    minuteAttendatns: string;
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
