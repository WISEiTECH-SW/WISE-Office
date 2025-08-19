import type { NextApiRequest, NextApiResponse } from "next";

export default function handle(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.jwt;

    if (token) {
        res.status(200).json({ loggedIn: true });
        // console.log("로그인되었습니다.");
    } else {
        res.status(200).json({ loggedIn: false });
        // console.log("로그인해주세요.");
    }
}
