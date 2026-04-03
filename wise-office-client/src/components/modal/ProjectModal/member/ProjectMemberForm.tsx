import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { useMembers } from "@/hooks/queries/useMember";
import { CreateProject, FormErrors } from "@/types/project";
import ProjectMemberSelector from "./ProjectMemberSelector";
import ErrorIndicator from "@/components/ui/ErrorIndicator";

interface ProjectMemberFormProps {
    form: CreateProject;
    errors: FormErrors;
    onChange: <K extends keyof CreateProject>(
        key: K,
        value: CreateProject[K],
    ) => void;
}

export default function ProjectMemberForm({
    form,
    errors,
    onChange,
}: ProjectMemberFormProps) {
    const { data, isLoading } = useMembers();

    if (isLoading) return <LoadingIndicator type="member" />;
    if (!data) return <ErrorIndicator />;

    return (
        <div className="grid grid-cols-2 h-full gap-4">
            <div className="flex flex-col px-4">
                <ProjectMemberSelector
                    members={data.members}
                    initialMembers={form.attendants}
                    isProposal={false}
                    managerId={form.projectLeaderId}
                    attendatnError={errors.attendants}
                    managerError={errors.projectLeaderId}
                    onSelectedMemberChange={(value) =>
                        onChange("attendants", value)
                    }
                    setManagerId={(value) => onChange("projectLeaderId", value)}
                />
            </div>
            <div className="flex flex-col px-4">
                <ProjectMemberSelector
                    members={data.companyMembers}
                    initialMembers={form.proposalAttendants}
                    isProposal={true}
                    managerId={form.projectManagerId}
                    attendatnError={errors.proposalAttendants}
                    managerError={errors.projectManagerId}
                    onSelectedMemberChange={(value) =>
                        onChange("proposalAttendants", value)
                    }
                    setManagerId={(value) =>
                        onChange("projectManagerId", value)
                    }
                />
            </div>
        </div>
    );
}
