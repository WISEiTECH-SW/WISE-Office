interface UserProfileProps {
    team: string;
    rank: string;
    setTeam: React.Dispatch<React.SetStateAction<string>>;
    setRank: React.Dispatch<React.SetStateAction<string>>;
}
export default function MyInfo({
    team,
    rank,
    setTeam,
    setRank,
}: UserProfileProps) {
    return (
        <div>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                    부서
                </label>
                <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={team ? team : ""}
                    onChange={(e) => setTeam(String(e.target.value))}
                >
                    <option value={"연구기획 1팀"}>연구기획 1팀</option>
                    <option value={"연구기획 2팀"}>연구기획 2팀</option>
                </select>
            </div>
            <div>
                <label className="block text-gray-700 font-semibold mb-2">
                    직급
                </label>
                <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={rank ? rank : ""}
                    onChange={(e) => setRank(String(e.target.value))}
                >
                    <option value={"주임"}>주임</option>
                    <option value={"선임"}>선임</option>
                    <option value={"책임"}>책임</option>
                    <option value={"수석"}>수석</option>
                    <option value={"팀장"}>팀장</option>
                </select>
            </div>
        </div>
    );
}
