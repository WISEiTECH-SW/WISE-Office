import { useMemo, useState } from "react";
import { Folder, FolderOpen } from "lucide-react";
import { useOverview } from "@/store/useOverviewStore";
import { menus } from "@/lib/data/overview";

export default function ProjectMenu() {
    const { year, projectId, setYear, setProjectId } = useOverview();
    const [openYear, setOpenYear] = useState<number[]>([
        Math.max(...menus.map((m) => m.year)),
    ]);

    const selectYear = (year: number) => {
        setOpenYear((prev) =>
            prev.includes(year)
                ? prev.filter((y) => y !== year)
                : [...prev, year],
        );
    };

    const sortedMenus = useMemo(
        () => [...menus].sort((a, b) => b.year - a.year),
        [],
    );

    return (
        <aside className="w-72">
            <ul>
                {sortedMenus.map((menu) => (
                    <li key={menu.year}>
                        <button
                            onClick={() => selectYear(menu.year)}
                            className="w-full flex items-center px-3 py-1 text-md rounded-lg hover:bg-gray-100 cursor-pointer"
                        >
                            <span className="mr-3">
                                {openYear.includes(menu.year) ? (
                                    <FolderOpen strokeWidth={1} />
                                ) : (
                                    <Folder strokeWidth={1} />
                                )}
                            </span>
                            <p
                                className={`${openYear.includes(menu.year) ? "font-bold" : ""}`}
                            >
                                {menu.year}
                            </p>
                        </button>

                        {openYear.includes(menu.year) && (
                            <ul className="ml-10 cursor-pointer">
                                {menu.items.map((item) => (
                                    <li
                                        key={item.project_pk}
                                        className={`px-3 py-1 mb-1 text-sm rounded-md hover:bg-gray-100 hover:font-medium ${item.project_pk === projectId && menu.year === year ? "bg-gray-100 font-medium" : ""}`}
                                        onClick={() => {
                                            setProjectId(item.project_pk);
                                            setYear(menu.year);
                                        }}
                                    >
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </aside>
    );
}
