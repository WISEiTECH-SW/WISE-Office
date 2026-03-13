import { useEffect, useMemo, useState } from "react";
import { Folder, FolderOpen } from "lucide-react";
import {
    useOverviewStore,
    useProjectsGroupByYearStore,
} from "@/store/useOverviewStore";

export default function ProjectMenu() {
    const { year, projectInfo, setYear, setProjectInfo } = useOverviewStore();
    const { groupByYear, fetchGroupByYear } = useProjectsGroupByYearStore();
    const [openYear, setOpenYear] = useState<number[]>([]);

    useEffect(() => {
        fetchGroupByYear();
    }, [fetchGroupByYear]);

    useEffect(() => {
        if (groupByYear.length > 0 && openYear.length === 0) {
            const latestYear = Math.max(...groupByYear.map((m) => m.year));
            setOpenYear([latestYear]);
        }
    }, [groupByYear, openYear]);

    const selectYear = (year: number) => {
        setOpenYear((prev) =>
            prev.includes(year)
                ? prev.filter((y) => y !== year)
                : [...prev, year],
        );
    };

    const sortedMenus = useMemo(
        () => [...groupByYear].sort((a, b) => b.year - a.year),
        [groupByYear],
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
                                {menu.projects.map((item) => (
                                    <li
                                        key={item.projectId}
                                        className={`px-3 py-1 mb-1 text-sm rounded-md hover:bg-gray-100 hover:font-medium ${item.projectId === projectInfo.projectId && menu.year === year ? "bg-gray-100 font-medium" : ""}`}
                                        onClick={() => {
                                            setProjectInfo({
                                                projectId: item.projectId,
                                                projectTitle: item.projectTitle,
                                            });
                                            setYear(menu.year);
                                        }}
                                    >
                                        {item.projectTitle}
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
