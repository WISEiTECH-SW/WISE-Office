import React, { useEffect, useState } from "react";
import UserProfile from "../components/account/UserProfile";
import ProjectCards_my from "@/components/account/ProjectCards_my";
import MyInfo from "@/components/account/MyInfo";
import axios from 'axios';


export const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

interface Profile{
    id: string;
    rank: string;
    team: string;
    name: string;
    imgUrl: string;
    projectList: Object;
}

export async function getProfile():Promise<Profile>{
    const {data} = await api.get<Profile>("/members/me");
    return data;
}

export default function Account() {

        const [profile, setProfile] = useState<Profile | null>(null);
        useEffect(() => {
            const fetchData = async () => {
            const profile = await getProfile();
            console.log("프로필: ", profile);
            setProfile(profile);
            }
            fetchData();
        }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
        <div className="max-w-6xl w-full grid grid-cols-12 gap-10">

            {/* 프로필 영역 - 가운데 정렬 */}
            <section className="col-span-12 md:col-span-2 rounded-lg p-6 flex flex-col items-center justify-center">
            <UserProfile {...profile} />
            </section>

            {/* 부서/직급 및 저장 버튼 영역 */}
            <section className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-md p-6 flex flex-col justify-center space-y-6">
            <MyInfo {...profile}/>

            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 transition duration-300">
                저장
            </button>
            </section>

            {/* 프로젝트 영역 */}
            <section className="col-span-12 md:col-span-7 bg-white rounded-lg shadow-md p-6">
                <ProjectCards_my {...profile} />
            </section>
        </div>
        </div>
    );
}
