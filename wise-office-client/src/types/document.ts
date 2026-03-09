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

export interface Approval {
    approve_pk: number;
    meeting_pk: number;
    report_no: string;
    write_date: Date;
    department: string;
    submit_date: Date;
}

export type DocType = "minute" | "approve" | "trip";
