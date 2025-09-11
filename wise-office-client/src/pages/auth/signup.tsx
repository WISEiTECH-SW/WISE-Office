import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toastMessage } from "@/lib/common/toastMessage";
import { SignupForm } from "@/types/member";
import {
    SignupSelect,
    SignupInput,
    EmailVerifyButton,
} from "@/components/signup";

import { validateEmailForm, validateEmailLen } from "@/lib/auth/signup";
import {
    handleEmailVerify,
    handleCodeVerify,
    handleSummitSignUpForm,
} from "@/hooks/handleSignup";

const RANK = ["직급을 선택해 주세요", "주임", "선임", "팀장", "수석"];
const TEAM = ["소속을 선택해 주세요", "연구기획 1팀", "연구기획 2팀"];

export default function Signup() {
    const router = useRouter();

    // name, rank, team
    const [name, setName] = useState("");
    const [rank, setRank] = useState("");
    const [team, setTeam] = useState("");

    // Email
    const [email, setEmail] = useState("");
    const [emailFormValid, setEmailFormValid] = useState(true);
    const [emailLenValid, setEmailLenValid] = useState(false);

    const [emailSuggestion, setEmailSuggestion] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [code, setCode] = useState("");
    const [isShowCodeInput, setIsShowCodeInput] = useState(false);
    const [loading, setLoading] = useState(false);

    const [emailValid, setEmailValid] = useState(false);

    // PassWord
    const [password, setPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState("");

    // form summit chek
    const isFormValid =
        name.trim() !== "" &&
        rank.trim() !== "" &&
        team.trim() !== "" &&
        emailValid &&
        password.trim() !== "" &&
        passwordMatch.trim() !== "" &&
        password === passwordMatch;

    // Email Valid Check
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputEmail = e.target.value;

        setEmail(inputEmail);
        setEmailFormValid(validateEmailForm(inputEmail));
        setEmailLenValid(validateEmailLen(inputEmail));

        if (inputEmail.length > 0) {
            setEmailSuggestion(`${inputEmail.split("@")[0]}@wise.co.kr`);
        } else {
            setEmailSuggestion("");
            setEmailFormValid(true);
        }
    };

    const handleEmailSuggestionClick = () => {
        setEmailSuggestion("");

        setEmail(emailSuggestion);
        setEmailFormValid(true);
        setEmailLenValid(validateEmailLen(emailSuggestion.split("@")[0]));
    };

    const verifyEmail = async () => {
        setLoading(true);
        const success = handleEmailVerify(email);
        if (await success) {
            setCode("");
            setLoading(false);
            setIsShowCodeInput(true);
            return true;
        }
        setLoading(false);
        return false;
    };

    const verifyCode = async () => {
        const success = await handleCodeVerify(email, code);
        console.log(success);

        if (success) {
            setEmailValid(true);
        } else {
            toastMessage.error("인증 코드를 다시 확인해 주세요.");
        }
    };

    const handleSummit = async (e: React.FormEvent) => {
        e.preventDefault();

        const signupInputData: SignupForm = {
            name,
            password,
            passwordMatch,
            team,
            rank,
            email,
        };

        const success = await handleSummitSignUpForm(signupInputData);

        if (success) {
            router.push("/auth/login");
        } else {
            router.push("/auth/signup");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setEmailSuggestion("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex items-center justify-center my-4">
            <form
                onSubmit={handleSummit}
                autoComplete="off"
                className="flex flex-col items-center w-full max-w-md gap-3 p-6 space-y-2 bg-white border border-gray-200 rounded-lg shadow-md"
            >
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    회원가입
                </h1>

                <SignupInput
                    labelName="이름"
                    id="name"
                    type="text"
                    value={name}
                    onChange={setName}
                />
                <SignupSelect
                    id="rank"
                    labelName="직급"
                    options={RANK}
                    value={rank}
                    onChange={setRank}
                />
                <SignupSelect
                    id="team"
                    labelName="소속"
                    options={TEAM}
                    value={team}
                    onChange={setTeam}
                />

                {/* Email */}
                <div className="w-full px-4">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                    >
                        이메일
                    </label>
                    <div className="flex gap-3 mt-1">
                        <div ref={wrapperRef} className="relative w-full">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none disabled:cursor-default"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="example@wise.co.kr"
                                disabled={emailValid}
                            />

                            {emailSuggestion && !emailFormValid && (
                                <div
                                    onClick={handleEmailSuggestionClick}
                                    className="absolute px-3 py-2 left-0 right-0 mt-1 cursor-pointer bg-white border border-gray-300 rounded p-2 shadow-lg text-sm text-gray-700 hover:bg-blue-50 z-10 overflow-auto"
                                >
                                    {emailSuggestion}
                                </div>
                            )}
                        </div>
                        <EmailVerifyButton
                            verifyEmail={verifyEmail}
                            disabled={!(emailFormValid && emailLenValid)}
                            emailValid={emailValid}
                        />
                    </div>
                    {!emailFormValid && (
                        <span className="px-1 text-sm text-red-500">
                            회사 도메인 이메일만 사용 가능합니다.
                        </span>
                    )}
                    {emailValid && (
                        <span className="px-1 text-sm text-green-500">
                            인증되었습니다.
                        </span>
                    )}
                </div>
                {loading && <div>인증 코드 전송 중...</div>}
                {isShowCodeInput && !emailValid && (
                    <div className="w-full px-4 mb-3">
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
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none "
                            />
                            <button
                                type="button"
                                onClick={verifyCode}
                                className="w-25 h-10.5 px-4 text-sm font-medium text-white bg-green-600 rounded-md whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
                            >
                                인증확인
                            </button>
                        </div>
                    </div>
                )}

                {/* Password */}
                <SignupInput
                    labelName="비밀번호"
                    id="password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                />
                <div className="w-full">
                    <SignupInput
                        labelName="비밀번호 확인"
                        id="passwordMatch"
                        type="password"
                        value={passwordMatch}
                        onChange={setPasswordMatch}
                    />
                    {passwordMatch.length > 0 && (
                        <p
                            className={`mt-1 px-4 text-sm ${
                                password === passwordMatch
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            {password === passwordMatch
                                ? "비밀번호가 일치합니다."
                                : "비밀번호가 일치하지 않습니다."}
                        </p>
                    )}
                </div>
                <div className="w-full px-4">
                    <button
                        type="submit"
                        className="w-full px-3 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 cursor-pointer disabled:cursor-default"
                        disabled={!isFormValid}
                    >
                        회원가입
                    </button>
                </div>
                <div className="flex gap-3 text-sm text-center">
                    <p className="text-gray-600">이미 계정이 있으신가요?</p>
                    <Link href="/auth/login">
                        <span className="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500">
                            로그인
                        </span>
                    </Link>
                </div>
            </form>
        </div>
    );
}
