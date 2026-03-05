import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, File, LayoutListIcon } from "lucide-react";

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
            <Link href="/" className={linkClass("/")}>
                <LayoutListIcon size={16} />
                <p className="">프로젝트 현황</p>
            </Link>

            <Link href="/overview" className={linkClass("/overview")}>
                <File size={16} />
                <p className="">전체 품의서</p>
            </Link>

            <Link
                href="/leave-calculator"
                className={linkClass("/leave-calculator")}
            >
                <Calculator size={16} />
                <p className="">연차계산기</p>
            </Link>
        </div>
    );
}
