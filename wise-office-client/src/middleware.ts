import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("jwt")?.value;
    const { pathname, searchParams } = req.nextUrl;

    // 비로그인 시 차단할 경로
    const protectedPath =
        pathname === "/projects" ||
        pathname.startsWith("/projects/") ||
        pathname === "/account";

    // 비로그인 시 차단 및 홈으로 리다이렉트
    if (protectedPath && !token) {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        if (!searchParams.get("toast")) {
            url.searchParams.set("toast", "login_required");
        }

        const redirectRes = NextResponse.redirect(url);

        // 캐시 방지
        redirectRes.headers.set("Cache-Control", "no-store");
        redirectRes.headers.set("Vary", "Cookie");

        return redirectRes;
    }

    const res = NextResponse.next();
    res.headers.set("logged-in", token ? "true" : "false");

    res.headers.set("Cache-Control", "no-store");
    res.headers.set("Vary", "Cookie");

    return res;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
