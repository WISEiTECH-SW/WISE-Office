import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: false,
    images: {
        domains: ["lh3.googleusercontent.com", "localhost"],
    },
};

export default nextConfig;
