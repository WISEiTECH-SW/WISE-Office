import { AxiosResponse } from "axios";
import { api } from "@/lib/clientApi";
import { Member, signupForm } from "@/types/member";
import { Profile, ProfileRequest } from "@/types/profile";

type verificationForm = {
    email: string;
    verificationCode: string;
};

type loginForm = {
    email: string;
    password: string;
};

export async function getMyProfile(): Promise<Profile> {
    const { data } = await api.get<Profile>("/members/me");
    return data;
}

export async function getMembers(): Promise<Member[]> {
    const { data } = await api.get<Member[]>("/members");
    return data;
}

export async function updateProfileInfo(
    req: ProfileRequest
): Promise<ProfileRequest[]> {
    return await api.patch("/members", req).then((res) => res.data);
}

export async function updateProfileImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("profile", file);

    const res = await api.patch("/members/images", formData);
    return res.data.imageUrl;
}

export async function signup(req: signupForm): Promise<signupForm> {
    const formData = new FormData();
    formData.append(
        "request",
        new Blob([JSON.stringify(req)], { type: "application/json" })
    );
    return await api.post("/members/signup", formData).then((res) => res.data);
}

export async function login(req: loginForm): Promise<AxiosResponse> {
    return await api.post("/members/login", req).then((res) => res.data);
}

export async function requestCode(req: string): Promise<string> {
    return await api
        .post("/members/emails/verification", { email: req })
        .then((res) => res.data);
}

export async function verifyCode(
    req: verificationForm
): Promise<verificationForm> {
    const { data } = await api.get("/members/emails/verification", {
        params: {
            email: req.email,
            code: req.verificationCode,
        },
    });
    return data;
}
