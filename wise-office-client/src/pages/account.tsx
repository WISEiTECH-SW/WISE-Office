import React, { useEffect, useState } from "react";
import UserProfile from "../components/account/UserProfile";
import MyInfo from "@/components/account/MyInfo";
import ProjectCardsMy from "@/components/account/ProjectCardsMy";
import { getMyProfile } from "@/services/members";
import { Profile } from "@/types/profile";
import { toastMessage } from "@/lib/common/toastMessage";

export default function Account() {
    const [profile, setProfile] = useState<Profile>();
    useEffect(() => {
        const fetchData = async () => {
            const profile = await getMyProfile();
            setProfile(profile);
        };
        fetchData();
    }, []);

    const onSave = () => {
        toastMessage.success("정보가 저장되었습니다.");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
            <div className="max-w-6xl w-full grid grid-cols-12 gap-10">
                {/* 프로필 영역 - 가운데 정렬 */}
                <section className="col-span-12 md:col-span-2 rounded-lg p-6 flex flex-col items-center justify-center">
                    {profile && <UserProfile props={profile} />}
                </section>

                {/* 부서/직급 및 저장 버튼 영역 */}
                <section className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-md p-6 flex flex-col justify-center space-y-6">
                    {profile && <MyInfo props={profile} />}

                    <button
                        onClick={onSave}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 transition duration-300"
                    >
                        저장
                    </button>
                </section>

                {/* 프로젝트 영역 */}
                <section className="col-span-12 md:col-span-7 bg-white rounded-lg shadow-md p-6">
                    {profile && <ProjectCardsMy props={profile} />}
                </section>
            </div>
        </div>
    );
}
