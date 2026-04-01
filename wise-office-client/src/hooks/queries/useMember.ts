import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { getMembers } from "@/services/members";

export const useMembers = () => {
    return useQuery({
        queryKey: queryKeys.members(),
        queryFn: () => getMembers(),
    });
};
