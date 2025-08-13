import ProjectListCard from "@/components/ProjectListCard";
import AddProjectButton from "@/components/AddProjectButton";

export default function Home() {
    return (
        <section className="mt-20 mb-30 px-12 py-5 px-70">
            <h2 className="text-3xl font-bold mb-2 text-left">
                프로젝트 진행 현황
            </h2>
            <div className="flex justify-end mb-10">
                <AddProjectButton />
            </div>

            <div className="flex flex-col items-center w-full gap-10 text-gray-600">
                <ProjectListCard />
                <ProjectListCard />
                <ProjectListCard />
                <ProjectListCard />
            </div>
        </section>
    );
}
