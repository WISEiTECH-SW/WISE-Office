import {
    toast,
    type ToastOptions,
    type Id,
    UpdateOptions,
} from "react-toastify";

const DEFAULT: ToastOptions = {
    autoClose: 2000,
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
    update(id: Id, msg: string, opts?: UpdateOptions) {
        toast.update(id, { render: msg, ...opts });
    },
    dismiss(id?: Id) {
        id ? toast.dismiss(id) : toast.dismiss();
    },
};
