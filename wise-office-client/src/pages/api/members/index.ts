import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const server = process.env.NEXT_PUBLIC_SERVER_URL!;
    const backendUrl = `${server}/api/members`;

    try {
        // PATCH 요청일 때만 실행
        if (req.method === "PATCH") {
            const r = await fetch(backendUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(req.body),
            });

            const data = await r.json();
            res.status(r.status).json(data);
            console.log("PATCH request data:", data);
        } else {
            // 허용되지 않은 메서드 처리
            res.setHeader("Allow", ["PATCH"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Proxy error" });
    }
}
