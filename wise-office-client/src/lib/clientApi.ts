import axios from "axios";

export const api = axios.create({
    // baseURL: "/api",
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
    // timeout: 10000,
});
