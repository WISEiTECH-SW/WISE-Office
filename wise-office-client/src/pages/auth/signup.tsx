import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const RANK = ["주임", "선임", "팀장", "수석"];
const TEAM = ["연구기획 1팀", "연구기획 2팀"];

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rank, setRank] = useState(RANK[0]);
    const [team, setTeam] = useState(TEAM[0]);
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [showDropdown, setShowDropdown] = useState(false);
    const DOMAIN = "wise.co.kr";
    const prefix = email.includes("@") ? email.split("@")[0] : email;
    const isValid = email === "" || email.endsWith(`@${DOMAIN}`);

    const handleSendVerificationCode = async () => {
        setIsCodeSent(true);
        // if (!email) {
        //   alert('이메일을 입력해주세요.');
        //   return;
        // }
        // try {
        //   // await axios.post('http://localhost:8080/api/members/email', { email });
        //   setIsCodeSent(true);
        //   alert('인증 코드가 이메일로 전송되었습니다.');
        // } catch (error) {
        //   console.error('Failed to send verification code:', error);
        //   alert('인증 코드 전송에 실패했습니다.');
        // }
    };

    const handleVerifyCode = () => {
        // TODO: Implement actual code verification logic against the backend
        setIsVerified(true);
        // setVerificationCode('qqqqqqqq')
        // if (verificationCode) { // Placeholder logic
        //   setIsVerified(true);
        //   alert('이메일 인증이 완료되었습니다.');
        // } else {
        //   alert('인증 코드를 입력해주세요.');
        // }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!isVerified) {
            alert("이메일 인증을 완료해주세요.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/api/members/signup",
                {
                    name,
                    email,
                    password,
                    team,
                    rank,
                }
            );

            if (response.status === 200) {
                alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
                router.push("/login");
            }
        } catch (error) {
            console.error("Signup failed:", error);
            if (axios.isAxiosError(error) && error.response) {
                alert(
                    `회원가입에 실패했습니다: ${
                        error.response.data.message || "서버 오류"
                    }`
                );
            } else {
                alert("회원가입에 실패했습니다.");
            }
        }
    };

    const handleSelectDomain = () => {
        setEmail(`${prefix}@${DOMAIN}`);
        setShowDropdown(false);
    };

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    회원가입
                </h1>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                        >
                            이름
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                        />
                    </div>

                    {/* rank Dropdown */}
                    <div>
                        <label
                            htmlFor="rank"
                            className="text-sm font-medium text-gray-700"
                        >
                            직급
                        </label>
                        <select
                            id="rank"
                            value={rank}
                            onChange={(e) => setRank(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                        >
                            {RANK.map((pos) => (
                                <option key={pos} value={pos}>
                                    {pos}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Department Dropdown */}
                    <div>
                        <label
                            htmlFor="team"
                            className="text-sm font-medium text-gray-700"
                        >
                            소속
                        </label>
                        <select
                            id="team"
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                        >
                            {TEAM.map((dep) => (
                                <option key={dep} value={dep}>
                                    {dep}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                        >
                            이메일
                        </label>
                        <div className="flex gap-3 ">
                            <div className="relative w-full" ref={wrapperRef}>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setEmail(value);

                                        // 사용자가 입력한 값 + @DOMAIN
                                        const suggestion = `${
                                            value.split("@")[0]
                                        }@${DOMAIN}`;

                                        // 드롭다운 표시 조건
                                        const shouldShow =
                                            value.length > 0 &&
                                            suggestion.startsWith(value);

                                        setShowDropdown(shouldShow);
                                    }}
                                    className="w-full px-3 py-2 border rounded-md"
                                    disabled={isCodeSent}
                                />
                                {/* 이메일 주소 추천 드롭다운 */}
                                {showDropdown && (
                                    <ul className="absolute inset-x-0 mt-1 bg-white border border-gray-500 rounded-md shadow-lg z-10 max-h-56 overflow-auto">
                                        <li
                                            onMouseDown={handleSelectDomain}
                                            className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                                        >
                                            {prefix}@{DOMAIN}
                                        </li>
                                    </ul>
                                )}
                                {/* 이메일 검증 메시지 */}
                                {email && !isValid && (
                                    <p className="px-1 mt-1 text-sm text-red-500">
                                        회사 도메인 이메일만 사용 가능합니다.
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleSendVerificationCode}
                                className="h-10.5 px-4 text-sm font-medium text-white bg-gray-600 rounded-md whitespace-nowrap"
                                disabled={isCodeSent}
                            >
                                인증요청
                            </button>
                        </div>
                    </div>
                    {isCodeSent && !isVerified && (
                        <div>
                            <label
                                htmlFor="verificationCode"
                                className="text-sm font-medium text-gray-700"
                            >
                                인증 코드
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    id="verificationCode"
                                    type="text"
                                    required
                                    value={verificationCode}
                                    onChange={(e) =>
                                        setVerificationCode(e.target.value)
                                    }
                                    className="w-full px-3 py-2 mt-1 border rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyCode}
                                    className="px-4 py-2 mt-1 text-sm font-medium text-white bg-green-600 rounded-md whitespace-nowrap"
                                >
                                    인증확인
                                </button>
                            </div>
                        </div>
                    )}
                    <div>
                        <label
                            htmlFor="password"
                            required
                            className="text-sm font-medium text-gray-700"
                        >
                            비밀번호
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            required
                            className="text-sm font-medium text-gray-700"
                        >
                            비밀번호 확인
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                            disabled={!isVerified}
                        >
                            회원가입
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <p className="text-gray-600">
                        이미 계정이 있으신가요?{" "}
                        <Link href="/login">
                            <span className="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500">
                                로그인
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
