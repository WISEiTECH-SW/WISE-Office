import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("jwt")?.value;

    // 조건부로 보호 경로 설정 가능

    const res = NextResponse.next();

    res.headers.set("logged-in", token ? "true" : "false");
    return res;
}
