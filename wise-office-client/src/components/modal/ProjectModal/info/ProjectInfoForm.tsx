import { CreateProject, FormErrors } from "@/types/project";
import ProjectInput from "./ProjectInput";
import TimePicker from "./TimePicker";

interface ProjectInfoFormProps {
    form: CreateProject;
    errors: FormErrors;
    onChange: <K extends keyof CreateProject>(
        key: K,
        value: CreateProject[K],
    ) => void;
}

export default function ProjectInfoForm({
    form,
    errors,
    onChange,
}: ProjectInfoFormProps) {
    return (
        <div className="grid grid-cols-2 h-full">
            <div className="flex flex-col px-4 justify-between h-full">
                <ProjectInput
                    label="연구개발과제명"
                    value={form.projectTitle}
                    placeholder="연구개발과제명을 입력하세요."
                    maxLength={50}
                    error={errors.projectTitle}
                    onChange={(value) => onChange("projectTitle", value)}
                />

                <ProjectInput
                    label="사업명 (사전품의서에 기입할 세부사업명, 총괄연구과제명
                        등)"
                    value={form.businessName}
                    placeholder="사업명을 입력하세요."
                    maxLength={50}
                    error={errors.businessName}
                    onChange={(value) => onChange("businessName", value)}
                />

                <ProjectInput
                    label="전담기관"
                    value={form.institution}
                    placeholder="전담기관을 입력하세요."
                    maxLength={50}
                    error={errors.institution}
                    onChange={(value) => onChange("institution", value)}
                />
            </div>
            <div className="flex flex-col px-4 justify-between h-full">
                <div className="flex flex-col gap-3">
                    <label className="block font-semibold text-gray-700 text-sm">
                        프로젝트 기간
                    </label>
                    <div className="flex justify-between items-center">
                        <TimePicker
                            value={form.start}
                            placeholder="시작 월 선택"
                            error={errors.start}
                            onChange={(value) => onChange("start", value)}
                        />
                        <span className="mb-4 px-2 text-lg font-semibold text-gray-600">
                            →
                        </span>
                        <TimePicker
                            value={form.end}
                            placeholder="종료 월 선택"
                            error={errors.end}
                            onChange={(value) => onChange("end", value)}
                        />
                    </div>
                </div>

                <ProjectInput
                    label="프로젝트 설명"
                    value={form.content}
                    placeholder="프로젝트에 대한 설명을 입력하세요."
                    maxLength={500}
                    error={errors.content}
                    onChange={(value) => onChange("content", value)}
                />
            </div>
        </div>
    );
}
