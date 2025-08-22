import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const server = process.env.NEXT_PUBLIC_SERVER_URL!;
    const backendUrl = `${server}/api/v2/projects`;

    try {
        const r = await fetch(backendUrl, {
            method: "POST",
            body: JSON.stringify(req.body),
        });

        const data = await r.json();
        res.status(r.status).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Proxy error" });
    }
}
