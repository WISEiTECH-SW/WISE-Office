import React, { useEffect, useState } from "react";
import { Profile } from "@/types/profile";
interface UserProfileProps{
    props:Profile;
}
export default function MyInfo({props}:UserProfileProps) {

    const [team, setTeam] = useState(props.team);
    const [rank, setRank] = useState(props.rank);
    return (
        <div>
            <div>
                <label className="block text-gray-700 font-semibold mb-2">부서</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                value={team} onChange={(e) => setTeam(e. target.value)}>
                <option>연구기획 1팀</option>
                <option>연구기획 2팀</option>
                </select>
            </div>
            <div>
                <label className="block text-gray-700 font-semibold mb-2">직급</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={rank} onChange={(e) => setRank(e. target.value)}>
                <option>주임</option>
                <option>선임</option>
                <option>수석</option>
                <option>팀장</option>
                </select>
            </div>
        </div>
    );
}