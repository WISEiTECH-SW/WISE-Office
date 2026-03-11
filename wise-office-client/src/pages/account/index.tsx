import React, { useEffect, useState } from "react";
import UserProfile from "@/components/account/UserProfile";
import MyInfo from "@/components/account/MyInfo";
import JoinDateField from "@/components/leave-tracker/OutputSection/JoinDateField";
import ProjectCardsMy from "@/components/account/ProjectCardsMy";
import {
    getJoinDate,
    getMyProfile,
    updateProfileInfo,
    updateJoinDate,
} from "@/services/members";
import { Profile, ProfileRequest } from "@/types/profile";
import { toastMessage } from "@/lib/common/toastMessage";

export default function Account() {
    const [profile, setProfile] = useState<Profile>();
    const [team, setTeam] = useState<string>("");
    const [rank, setRank] = useState<string>("");
    const [joinDate, setJoinDate] = useState<string>("");

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

    const onSave = () => {
        toastMessage.success("정보가 저장되었습니다.");
    };

    const updateProfile = async () => {
        const req: ProfileRequest = {
            team,
            rank,
        };
        try {
            await updateProfileInfo(req);
            onSave();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateJoinDate = async () => {
        try {
            await updateJoinDate(joinDate);
            onSave();
        } catch (error) {
            console.log("입사일 업데이트 실패:", error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-center items-start px-4">
            <div className="md:mt-10 max-w-6xl w-full md:grid md:grid-cols-12 gap-10">
                {/* 프로필 영역 - 가운데 정렬 */}
                <section className="col-span-12 md:col-span-2 rounded-lg p-6 flex flex-col items-center justify-center gap-6">
                    {profile && <UserProfile props={profile} />}
                </section>

                {/* 부서/직급 및 저장 버튼 영역 */}
                <section className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-md p-6 flex flex-col justify-center space-y-6 mb-6">
                    {profile && (
                        <MyInfo
                            team={team}
                            rank={rank}
                            setTeam={setTeam}
                            setRank={setRank}
                        />
                    )}
                    <button
                        onClick={updateProfile}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 transition duration-300 cursor-pointer"
                    >
                        저장
                    </button>
                    <JoinDateField
                        id="hire-date"
                        labelName="입사일"
                        value={joinDate}
                        onChange={setJoinDate}
                        page="account"
                    />
                    <button
                        onClick={handleUpdateJoinDate}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 transition duration-300 cursor-pointer"
                    >
                        저장
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
