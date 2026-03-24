import { toast, type ToastOptions } from "react-toastify";
import { DeleteModalType } from "@/types/project";
type ActionType = "create" | "update" | "delete";

const DEFAULT: ToastOptions = {
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    position: "top-right",
};

export const toastMessage = {
    success(msg: string, opts?: ToastOptions) {
        return toast(msg, { ...DEFAULT, type: "success", ...opts });
    },
    error(msg: string, opts?: ToastOptions) {
        return toast(msg, { ...DEFAULT, type: "error", ...opts });
    },
    info(msg: string, opts?: ToastOptions) {
        return toast(msg, { ...DEFAULT, type: "info", ...opts });
    },
    successDoc(
        docType: DeleteModalType,
        action: ActionType,
        opts?: ToastOptions,
    ) {
        return toast(`${docTypeLabel[docType]} ${actionLabel[action]}`, {
            ...DEFAULT,
            type: "success",
            ...opts,
        });
    },
};

const docTypeLabel: Record<DeleteModalType, string> = {
    project: "프로젝트가",
    log: "로그가",
    comment: "댓글이",
    minute: "회의록이",
    approve: "품의서가",
};

const actionLabel: Record<ActionType, string> = {
    create: "생성되었습니다.",
    update: "수정되었습니다.",
    delete: "삭제되었습니다.",
};
