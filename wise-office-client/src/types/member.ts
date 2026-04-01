export interface Member {
    memberId: number;
    rank: string;
    role: string; // "PM" | "NORMAL"
    team: string;
    name: string;
    role: string;
}

export interface SignupForm {
    name: string;
    password: string;
    passwordMatch: string;
    team: string;
    rank: string;
    email: string;
}

export interface GroupedMember {
    members: Member[];
    companyMembers: Member[];
}

export type EmailVerificationResponse = {
    verification: boolean;
    successCode: string;
};

export type ChangePasswordForm = {
    successToken: string;
    password: string;
    passwordCheck: string;
};

export type LoginResponse = {
    expiredAt: string;
};
