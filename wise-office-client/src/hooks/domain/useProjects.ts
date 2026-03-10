import { deleteProjectApi } from "@/services/projects";
import { toastMessage } from "@/lib/common/toastMessage";
import { useRouter } from "next/router";

export function useProjects(projectId: number) {
    const router = useRouter();

    // 프로젝트 삭제
    const removeProject = () => {
        try {
            deleteProjectApi(projectId);
            toastMessage.success("프로젝트가 삭제되었습니다.");
            router.push("/");
        } catch (error) {
            console.log("프로젝트 삭제 실패: ", error);
        }
    };

    return { removeProject };
}
