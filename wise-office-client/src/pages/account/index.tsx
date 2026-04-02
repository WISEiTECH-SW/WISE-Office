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
    updatePassword,
} from "@/services/members";
import { Profile } from "@/types/profile";
import { getErrorMessage } from "@/utils/ErrorParser";
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

    const handleUpdatePassword = async () => {
        const MIN_PASSWORD_LENGTH = 8;
        const MAX_PASSWORD_LENGTH = 20;

        if (newPassword) {
            if (
                newPassword.length < MIN_PASSWORD_LENGTH ||
                newPassword.length > MAX_PASSWORD_LENGTH
            ) {
                toastMessage.error(
                    `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상 ${MAX_PASSWORD_LENGTH}자 이하로 입력해 주세요.`,
                );

                return;
            }
            if (newPassword !== newPasswordCheck) {
                toastMessage.error("비밀번호가 일치하지 않습니다.");
                return;
            }
        }

        try {
            await updatePassword({
                password: newPassword,
                passwordCheck: newPasswordCheck,
            });
            logout();
            toastMessage.success("변경된 비밀번호로 다시 로그인해 주세요.");
            router.push("/auth/login");
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toastMessage.error(errorMessage, {
                style: { whiteSpace: "pre-line" },
            });
        }
    };

    const handleUpdateAccountInfo = async () => {
        try {
            await updateMemberAccount({
                team,
                rank,
                hireDate: joinDate || undefined,
            });

            toastMessage.success("정보가 저장되었습니다.");
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toastMessage.error(errorMessage, {
                style: { whiteSpace: "pre-line" },
            });
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
                    {/* 회사 정보 영역 */}
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
                    <button
                        onClick={handleUpdateAccountInfo}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 transition duration-300 cursor-pointer"
                    >
                        인사 정보 변경
                    </button>
                    {/* 비밀번호 변경 영역 */}
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
                    <button
                        onClick={handleUpdatePassword}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 transition duration-300 cursor-pointer"
                    >
                        비밀번호 변경
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
