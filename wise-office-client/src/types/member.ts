export interface Member {
    memberId: number;
    rank: string;
    team: string;
    name: string;
}

export interface SignupForm {
    name: string;
    password: string;
    passwordMatch: string;
    team: string;
    rank: string;
    email: string;
    hireDate: string;
}
