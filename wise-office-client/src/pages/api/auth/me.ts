import type { NextApiRequest, NextApiResponse } from "next";

export default function handle(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.jwt;

    if (token) {
        res.status(200).json({ loggedIn: true });
        console.log("로그인 상태입니다.");
    } else {
        res.status(200).json({ loggedIn: false });
        console.log("로그아웃 상태입니다.");
    }
}
