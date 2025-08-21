// import axios from "axios";

// export const api = axios.create({
//     baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
//     withCredentials: true,
// });

import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
} from "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        skipAuth?: boolean;
    }
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

const api: AxiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
    if (!config.skipAuth) {
        const token =
        typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

        if (token && config.headers?.set) {
        config.headers.set("Authorization", `Bearer ${token}`);
        }
    }

    return config;
});

export { api };