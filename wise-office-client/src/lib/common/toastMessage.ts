import {
    toast,
    type ToastOptions,
} from "react-toastify";

const DEFAULT: ToastOptions = {
    autoClose: 500,
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
};
