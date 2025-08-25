import { api } from "@/lib/clientApi";
import { Member } from "@/types/member";
import { Profile, ProfileRequest } from "@/types/profile";

export async function getMyProfile(): Promise<Profile> {
    const { data } = await api.get<Profile>("/members/me");
    return data;
}

export async function getMembers(): Promise<Member[]> {
    const { data } = await api.get<Member[]>("/members");
    return data;
}

export async function updateProfileInfo(req: ProfileRequest): Promise<ProfileRequest[]> {
    // const { team, rank } = req;
    // const query = `?team=${encodeURIComponent(team)}&rank=${encodeURIComponent(rank)}`;
    // return await api.patch(`/members${query}`).then((res) => res.data);

    return await api.patch("/members", req).then((res) => res.data);
}
