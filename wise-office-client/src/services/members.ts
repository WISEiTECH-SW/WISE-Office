import { api } from "@/lib/clientApi";
import { Profile } from "@/types/profile";

export async function getMyProfile(): Promise<Profile> {
    const { data } = await api.get<Profile>("/members/me");
    return data;
}
