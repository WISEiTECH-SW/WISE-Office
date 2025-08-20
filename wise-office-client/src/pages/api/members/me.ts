import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const server = process.env.SERVER_URL!;
    const backendUrl = `${server}/api/members/me`;

    try {
        const r = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(req.cookies.jwt
                    ? { Authorization: `Bearer ${req.cookies.jwt}` }
                    : {}),
                ...(req.cookies.jwt
                    ? { Cookie: `jwt=${req.cookies.jwt}` }
                    : {}),
                Accept: "application/json",
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
