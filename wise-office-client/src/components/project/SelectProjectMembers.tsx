// import { Member } from "@/types/member";
// import MemberSelector from "../modal/ProjectModal/MemberSelector";
// import CompanyMemberSelector from "../modal/ProjectModal/CompanyMemberSelector";

// interface SelectProjectMembersProps {
//     members: Member[];
//     companyMembers: Member[];
//     selectedMembers: Member[];
//     selectedCompanyMembers: Member[];
//     manager: Member | undefined;
//     memberSearchText: string;
//     companyMemberSearchText: string;
//     setSelectedMembers: React.Dispatch<React.SetStateAction<Member[]>>;
//     setSelectedCompanyMembers: React.Dispatch<React.SetStateAction<Member[]>>;
//     setManager: React.Dispatch<React.SetStateAction<Member | undefined>>;
//     setMemberSearchText: React.Dispatch<React.SetStateAction<string>>;
//     setCompanyMemberSearchText: React.Dispatch<React.SetStateAction<string>>;
//     errors: {
//         projectTitle: string;
//         startDate: string;
//         endDate: string;
//         content: string;
//         selectedMembers: string;
//         manager: string;
//     };
// }

// export default function SelectProjectMembers({
//     members,
//     companyMembers,

//     selectedMembers,
//     selectedCompanyMembers,

//     manager,

//     memberSearchText,
//     companyMemberSearchText,
//     setSelectedMembers,
//     setSelectedCompanyMembers,
//     setManager,
//     setMemberSearchText,
//     setCompanyMemberSearchText,
//     errors,
// }: SelectProjectMembersProps) {
//     return (
//         <div className="grid grid-cols-2 gap-10 w-full">
//             {/* 수행 인원 */}
//             <MemberSelector
//                 members={members}
//                 selectedMembers={selectedMembers}
//                 manager={manager}
//                 memberSearchText={memberSearchText}
//                 setSelectedMembers={setSelectedMembers}
//                 setManager={setManager}
//                 setMemberSearchText={setMemberSearchText}
//                 errors={errors}
//             />

//             {/* 편성 인원 */}
//             <CompanyMemberSelector
//                 companyMembers={companyMembers}
//                 selectedCompanyMembers={selectedCompanyMembers}
//                 companyMemberSearchText={companyMemberSearchText}
//                 setSelectedCompanyMembers={setSelectedCompanyMembers}
//                 setCompanyMemberSearchText={setCompanyMemberSearchText}
//             />
//         </div>
//     );
// }
