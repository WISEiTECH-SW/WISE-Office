import MyInfo from "@/components/account/MyInfo";
import ProjectCardsMy from "@/components/account/ProjectCardsMy";
import UserProfile from "@/components/account/UserProfile";
import JoinDateField from "@/components/leave-tracker/OutputSection/JoinDateField";
import { toastMessage } from "@/lib/common/toastMessage";
import {
    getJoinDate,
    getMyProfile,
    logout,
    updateMemberAccount,
} from "@/services/members";
import { Profile } from "@/types/profile";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Account() {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile>();
    const [team, setTeam] = useState<string>("");
    const [rank, setRank] = useState<string>("");
    const [joinDate, setJoinDate] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [newPasswordCheck, setNewPasswordCheck] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const profile = await getMyProfile();
            setProfile(profile);
            setTeam(profile.team);
            setRank(profile.rank);
            getJoinDate().then((date) => setJoinDate(date));
        };
        fetchData();
    }, []);

    const handleUpdateAccountInfo = async () => {
        if (newPassword) {
            if (newPassword.length < 8 || newPassword.length > 20) {
                toastMessage.error(
                    "비밀번호는 8자 이상 20자 이하로 입력해 주세요.",
                );
                return;
            }
            if (newPassword !== newPasswordCheck) {
                toastMessage.error("비밀번호가 일치하지 않습니다.");
                return;
            }
        }

        try {
            const res = await updateMemberAccount({
                team,
                rank,
                hireDate: joinDate || undefined,
                password: newPassword || undefined,
                passwordCheck: newPasswordCheck || undefined,
            });

            if (res.passwordChanged) {
                await logout();
                router.push("/auth/login");
            } else {
                toastMessage.success("정보가 저장되었습니다.");
            }
        } catch (error) {
            console.error(error);
            toastMessage.error("정보 변경 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-center items-start px-4">
            <div className="md:mt-10 max-w-6xl w-full md:grid md:grid-cols-12 gap-10">
                {/* 프로필 영역 - 가운데 정렬 */}
                <section className="col-span-12 md:col-span-2 rounded-lg p-6 flex flex-col items-center justify-center gap-6">
                    {profile && <UserProfile props={profile} />}
                </section>

                {/* 개인정보 확인 및 변경 영역 */}
                <section className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-md p-6 flex flex-col justify-center space-y-6 mb-6">
                    {profile && (
                        <MyInfo
                            team={team}
                            rank={rank}
                            setTeam={setTeam}
                            setRank={setRank}
                        />
                    )}
                    <JoinDateField
                        id="hire-date"
                        labelName="입사일"
                        value={joinDate}
                        onChange={setJoinDate}
                        page="account"
                    />
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                비밀번호 변경
                            </label>
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={newPassword || ""}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                비밀번호 변경 확인
                            </label>
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={newPasswordCheck || ""}
                                onChange={(e) =>
                                    setNewPasswordCheck(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleUpdateAccountInfo}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 transition duration-300 cursor-pointer"
                    >
                        정보 변경하기
                    </button>
                </section>

                {/* 프로젝트 영역 */}
                <section className="col-span-12 md:col-span-7 bg-white rounded-lg shadow-md p-6 mb-6">
                    {profile && <ProjectCardsMy props={profile} />}
                </section>
            </div>
        </div>
    );
}
