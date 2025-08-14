import axios from "axios";

export const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    // timeout: 10000,
});
