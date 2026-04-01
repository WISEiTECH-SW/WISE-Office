import { CreateProject } from "@/types/project";

export const projectDefaultForm: CreateProject = {
    projectTitle: "",
    institution: "",
    businessName: "",
    start: "",
    end: "",
    content: "",
    projectManagerId: undefined,
    projectLeaderId: undefined,
    attendants: [],
    proposalAttendants: [],
};
