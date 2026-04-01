import { PageInfo } from "@/types/page";
import PagenationButton from "./PagenationButton";

interface PagenationProps {
    pageInfo: PageInfo;
    onPageChange: (page: number) => void;
}

const getPageList = (current: number, total: number) => {
    const size = Math.min(5, total);
    const start = Math.max(1, Math.min(current - 2, total - size + 1));

    return Array.from({ length: size }, (_, i) => start + i);
};

export default function Pagenation({
    pageInfo,
    onPageChange,
}: PagenationProps) {
    return (
        <nav className="flex gap-4">
            <PagenationButton
                label="첫 페이지"
                isNumber={false}
                onClick={() => onPageChange(1)}
                isDisabled={pageInfo.currentPage === 1}
            />

            <ul className="flex items-center gap-2">
                {getPageList(pageInfo.currentPage, pageInfo.totalPages).map(
                    (page) => (
                        <li key={page}>
                            <PagenationButton
                                label={page}
                                isNumber={true}
                                onClick={() => onPageChange(page as number)}
                                isSelected={pageInfo.currentPage === page}
                            />
                        </li>
                    ),
                )}
            </ul>

            <PagenationButton
                label="끝 페이지"
                isNumber={false}
                onClick={() => onPageChange(pageInfo.totalPages)}
                isDisabled={pageInfo.currentPage === pageInfo.totalPages}
            />
        </nav>
    );
}
