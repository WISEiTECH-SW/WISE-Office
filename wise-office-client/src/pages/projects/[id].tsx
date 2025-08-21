import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import type { ProjectInfo } from "@/types/project";
import { editProjectInfo, deleteProject } from "@/lib/project/info";
import { getProjectById } from "@/services/projects";

import {
    ProjectInfoContainer,
    ProjectAttendantList,
} from "@/components/project";

export default function projectPageById() {
    const router = useRouter();
    const { id } = router.query;
    const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);

    useEffect(() => {
        if (!router.isReady) return;
        if (typeof id !== "string") return;

        const projectId = Number(id);
        if (isNaN(projectId)) return;

        getProjectById(projectId).then(setProjectInfo).catch(console.error);
        // log list
        // comment list
    }, [router.isReady, id]);

    if (!projectInfo) return <div>!!No Project!!</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6">
                {/* Project Information */}
                <ProjectInfoContainer
                    projectInfo={projectInfo}
                    onEdit={editProjectInfo}
                    onDelete={deleteProject}
                />
                <div className="grid grid-cols-12 gap-6">
                    {/* LOG List - Left */}
                    <div className="col-span-3">
                        <div className="mt-2"></div>
                    </div>
                    {/* LOG & Comment - Center */}
                    <div className="col-span-6"></div>
                    {/* Attendant List - Right */}
                    <div className="col-span-3">
                        <ProjectAttendantList
                            attendants={projectInfo.attendant}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
