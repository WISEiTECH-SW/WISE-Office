import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signupForm } from "@/types/member";
import { useRouter } from "next/router";
import {
    handleRequestCode,
    handleVerifyCode,
    handleSignup,
} from "@/hooks/handleSignup";

const RANK = ["주임", "선임", "팀장", "수석"];
const TEAM = ["연구기획 1팀", "연구기획 2팀"];

const SignupPage = () => {
    const [formData, setFormData] = useState<signupForm>({
        name: "",
        email: "",
        password: "",
        passwordMatch: "",
        rank: RANK[0],
        team: TEAM[0],
    });

    const handleChange = (field: keyof signupForm, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const [showDropdown, setShowDropdown] = useState(false);
    const DOMAIN = "wise.co.kr";
    const prefix = formData.email.includes("@")
        ? formData.email.split("@")[0]
        : formData.email;
    const isValid =
        formData.email === "" || formData.email.endsWith(`@${DOMAIN}`);

    const handleSelectDomain = () => {
        setFormData((prev) => ({
            ...prev,
            email: `${prefix}@${DOMAIN}`,
        }));
        setShowDropdown(false);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 비밀번호 일치 확인 및 토스트 메시지 처리
        if (formData.password !== formData.passwordMatch) {
            return;
        }

        try {
            await handleSignup(formData);
            router.push("/auth/login");
        } catch {
            // 실패 시 메시지는 handleSignup 안에서 처리
        }
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

    // 필수 입력 필드와 이메일 인증 여부를 검사하는 변수
    const isFormValid =
        formData.name.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.password.trim() !== "" &&
        formData.passwordMatch.trim() !== "" &&
        formData.password === formData.passwordMatch &&
        isValid &&
        isVerified;

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center w-full max-w-md gap-3 p-8 space-y-2 bg-white border border-gray-200 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    회원가입
                </h1>
                <form
                    onSubmit={onSubmit}
                    autoComplete="off"
                    className="w-full space-y-3 px-4"
                >
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
                            value={formData.name}
                            onChange={(e) =>
                                handleChange("name", e.target.value)
                            }
                            className="w-full px-3 py-2 mt-1 border border-gray-400 rounded-md outline-none"
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
                            value={formData.rank}
                            onChange={(e) =>
                                handleChange("rank", e.target.value)
                            }
                            className="w-full px-3 py-2 mt-1 border border-gray-400 rounded-md outline-none"
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
                            value={formData.team}
                            onChange={(e) =>
                                handleChange("team", e.target.value)
                            }
                            className="w-full px-3 py-2 mt-1 border border-gray-400 rounded-md outline-none"
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
                        <div className="flex gap-3 mt-1">
                            <div className="relative w-full" ref={wrapperRef}>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleChange("email", value);

                                        const suggestion = `${
                                            value.split("@")[0]
                                        }@${DOMAIN}`;

                                        const shouldShow =
                                            value.length > 0 &&
                                            suggestion.startsWith(value);

                                        setShowDropdown(shouldShow);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none disabled:cursor-default"
                                    disabled={isCodeSent}
                                />
                                {showDropdown && (
                                    <ul className="absolute inset-x-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-56 overflow-auto">
                                        <li
                                            onMouseDown={handleSelectDomain}
                                            className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                                        >
                                            {prefix}@{DOMAIN}
                                        </li>
                                    </ul>
                                )}
                                {formData.email &&
                                    !showDropdown &&
                                    !isValid && (
                                        <p className="px-1 mt-1 text-sm text-red-500">
                                            회사 도메인 이메일만 사용
                                            가능합니다.
                                        </p>
                                    )}
                                {isVerified && (
                                    <p className="px-1 mt-1 text-sm text-green-500">
                                        인증되었습니다.
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    handleRequestCode(formData.email);
                                    setIsCodeSent(true);
                                    setTimeout(() => {
                                        setIsCodeSent(false);
                                    }, 60 * 1000); // 60초 후 재요청 가능
                                }}
                                className="h-10.5 px-4 text-sm font-medium text-white bg-gray-600 rounded-md whitespace-nowrap cursor-pointer disabled:bg-gray-300 disabled:cursor-default"
                                disabled={isCodeSent || !isValid}
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
                            <div className="flex items-center space-x-2 mt-1">
                                <input
                                    id="verificationCode"
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) =>
                                        setVerificationCode(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none "
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleVerifyCode(
                                            formData.email,
                                            verificationCode,
                                            setIsVerified
                                        )
                                    }
                                    className="h-10.5 px-4 text-sm font-medium text-white bg-green-600 rounded-md whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
                                >
                                    인증확인
                                </button>
                            </div>
                        </div>
                    )}
                    <div>
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                        >
                            비밀번호
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                handleChange("password", e.target.value)
                            }
                            className="w-full px-3 py-2 mt-1 border border-gray-400 rounded-md outline-none"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="passwordMatch"
                            className="text-sm font-medium text-gray-700"
                        >
                            비밀번호 확인
                        </label>
                        <input
                            id="passwordMatch"
                            type="password"
                            value={formData.passwordMatch}
                            onChange={(e) =>
                                handleChange("passwordMatch", e.target.value)
                            }
                            className="w-full px-3 py-2 mt-1 border border-gray-400 rounded-md outline-none"
                        />
                        {formData.passwordMatch.length > 0 && (
                            <p
                                className={`mt-1 text-sm ${
                                    formData.password === formData.passwordMatch
                                        ? "text-green-500"
                                        : "text-red-500"
                                }`}
                            >
                                {formData.password === formData.passwordMatch
                                    ? "비밀번호가 일치합니다."
                                    : "비밀번호가 일치하지 않습니다."}
                            </p>
                        )}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full px-3 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 cursor-pointer"
                            disabled={!isFormValid}
                        >
                            회원가입
                        </button>
                    </div>
                </form>
                <div className="flex gap-3 text-sm text-center">
                    <p className="text-gray-600">이미 계정이 있으신가요?</p>
                    <Link href="/auth/login">
                        <span className="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500">
                            로그인
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
