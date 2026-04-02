import { api } from "@/lib/clientApi";
import {
    ChangePasswordRequest,
    EmailVerificationResponse,
    GroupedMember,
    LoginResponse,
    MemberAccountUpdateRequest,
    MemberAccountUpdateResponse,
    ResetPasswordRequest,
    SignupForm,
} from "@/types/member";
import { Profile, ProfileRequest } from "@/types/profile";

type loginForm = {
    email: string;
    password: string;
};

export async function getMyProfile(): Promise<Profile> {
    const { data } = await api.get<Profile>("/members/me");
    return data;
}

export async function getJoinDate(): Promise<string> {
    const { data } = await api.get("/members/hire-date");
    return data.hireDate;
}

export async function getMembers(): Promise<GroupedMember> {
    const { data } = await api.get<GroupedMember>("/members");
    return data;
}

export async function updateProfileInfo(
    req: ProfileRequest,
): Promise<ProfileRequest[]> {
    return await api.patch("/members", req).then((res) => res.data);
}

export async function updateProfileImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("profile", file);

    const res = await api.patch("/members/images", formData);
    return res.data.imageUrl;
}

export async function updateJoinDate(hireDate: string): Promise<string> {
    const { data } = await api.patch("members/hire-date", { hireDate });
    return data.hireDate;
}

// 회원가입 진행
export async function signup(req: SignupForm): Promise<SignupForm> {
    const formData = new FormData();
    formData.append(
        "request",
        new Blob([JSON.stringify(req)], { type: "application/json" }),
    );
    return await api.post("/members/signup", formData).then((res) => res.data);
}

export async function login(req: loginForm): Promise<string> {
    return await api
        .post("/members/login", req)
        .then((res) => res.data.expiredAt);
}

export async function logout(): Promise<number> {
    return await api.get("/members/logout").then((res) => res.status);
}

// 이메일 인증 코드 발송
export async function requestCode(req: string): Promise<string> {
    return await api
        .post("/members/emails/verification", { email: req })
        .then((res) => res.data);
}

// 이메일 검증 인증 코드 검사
export async function verifyCode(
    inputEmail: string,
    inputCode: string,
): Promise<boolean> {
    const res = await api.get("/members/emails/verification", {
        params: {
            email: inputEmail,
            code: inputCode,
        },
    });
    return res.data["verification"];
}

// 비밀번호 변경을 위한 코드 요청
export async function requestFindPasswordCode(req: string): Promise<void> {
    await api.post("/members/email/find-password", { email: req });
}

// 코드 검증
export async function verifyFindPasswordCode(
    inputEmail: string,
    inputCode: string,
): Promise<EmailVerificationResponse> {
    const { data } = await api.get<EmailVerificationResponse>(
        "/members/email/find-password/verification",
        {
            params: {
                email: inputEmail,
                code: inputCode,
            },
        },
    );
    return data;
}

// 계정 정보 수정, 비밀번호는 변경시 로그아웃 처리
export async function updateMemberAccount(
    req: MemberAccountUpdateRequest,
): Promise<MemberAccountUpdateResponse> {
    const { data } = await api.patch<MemberAccountUpdateResponse>(
        "/members/account",
        req,
    );
    return data;
}

// 비밀번호 초기화 요청
export async function resetPassword(req: ResetPasswordRequest): Promise<void> {
    await api.patch("/members/email/find-password/verification", req);
}

//로그인 연장 요청
export async function extendLoginSession(): Promise<string> {
    const { data } = await api.post<LoginResponse>("/members/extend");
    return data.expiredAt;
}

// 비밀번호 변경 요청
export async function updatePassword(
    req: ChangePasswordRequest,
): Promise<void> {
    await api.patch("/members/password", req);
}
