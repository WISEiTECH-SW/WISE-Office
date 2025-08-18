import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const server = process.env.SERVER_URL!;
    const backendUrl = `${server}/api/projects`;

    try {
        const r = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // JWT 쿠키 읽어서 Authorization 헤더 붙이기
                ...(req.cookies.accessToken
                    ? { Authorization: `Bearer ${req.cookies.accessToken}` }
                    : {}),
            },
        });

        const data = await r.json();
        res.status(r.status).json(data);
        console.log("request data: ", data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Proxy error" });
    }
}
