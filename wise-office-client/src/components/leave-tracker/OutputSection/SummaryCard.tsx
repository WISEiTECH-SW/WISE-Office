type SummaryCardProps = {
    title: string;
    count: number;
    bg: string;
};

export default function SummaryCard({ title, count, bg }: SummaryCardProps) {
    return (
        <div
            className={`w-full h-18 md:h-18 border rounded-lg border-gray-300 py-2 flex flex-col items-center justify-around ${bg}`}
        >
            <p className="text-xs lg:text-sm font-medium">{title}</p>
            <p className="text-base lg:text-xl font-bold">{count}</p>
        </div>
    );
}
