import { api } from "@/lib/clientApi";
import { GroupedMember, Member, SignupForm } from "@/types/member";
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
