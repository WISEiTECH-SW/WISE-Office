import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: false,
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8080",
            },
            {
                protocol: "http", // PROD 환경에서 사용
                hostname: "10.0.21.185", // PROD 환경 실행시 본인의 IP로 변경
                port: "8081",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

export default nextConfig;
