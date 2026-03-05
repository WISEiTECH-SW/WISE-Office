import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, File, LayoutListIcon } from "lucide-react";

const toolbarLinks = [
    { href: "/", Icon: LayoutListIcon, label: "프로젝트 현황" },
    { href: "/overview", Icon: File, label: "전체 품의서" },
    { href: "/leave-calculator", Icon: Calculator, label: "연차계산기" },
];

export default function Toolbar() {
    const pathname = usePathname();

    const linkClass = (path: string) =>
        `flex items-center gap-2 px-3 py-1 rounded-sm transition-colors ${
            pathname === path
                ? "bg-blue-500/10 text-blue-600 font-semibold"
                : "text-text-primary hover:bg-gray-100"
        }`;

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
