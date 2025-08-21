import { api } from "@/lib/clientApi";
import { Member } from "@/types/member";
import { Profile } from "@/types/profile";

export async function getMyProfile(): Promise<Profile> {
    const { data } = await api.get<Profile>("/members/me");
    return data;
}

export async function getMembers(): Promise<Member[]> {
    const { data } = await api.get<Member[]>("/members");
    return data;
}