import { toastMessage } from "../common/toastMessage";

export const editProjectInfo = () => {
    toastMessage.success("프로젝트 정보가 수정되었습니다.");
};

// common 으로 이동 필요
export const deleteProject = () => {
    toastMessage.success("프로젝트가 삭제되었습니다.");
};
