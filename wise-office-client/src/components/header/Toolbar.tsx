import Link from "next/link";
import { useRouter } from "next/router";
import { Calculator, File, LayoutListIcon } from "lucide-react";

const toolbarLinks = [
    { href: "/", Icon: LayoutListIcon, label: "프로젝트 현황" },
    { href: "/overview", Icon: File, label: "문서 현황" },
    { href: "/leave-calculator", Icon: Calculator, label: "연차계산기" },
];

export default function Toolbar() {
    const router = useRouter();
    const pathname = router.asPath;

    const linkClass = (path: string) => {
        const isActive =
            path === "/"
                ? pathname === "/" || pathname.startsWith("/projects/")
                : pathname.startsWith(path);

        return `flex items-center gap-2 px-3 py-1 rounded-sm transition-colors ${
            isActive
                ? "bg-blue-500/10 !text-blue-600 font-semibold"
                : "!text-text-primary hover:bg-gray-100"
        }`;
    };

    return (
        <div className="bg-background-default border-b px-4 border-gray-200 shadow-xs p-2 flex items-center gap-2 text-xs font-medium">
            {toolbarLinks.map(({ href, Icon, label }) => (
                <Link key={href} href={href} className={linkClass(href)}>
                    <Icon size={16} />
                    <p>{label}</p>
                </Link>
            ))}
        </div>
    );
}
