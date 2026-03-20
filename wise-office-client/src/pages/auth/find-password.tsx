import { useCountDown } from "@/hooks/useCountDown";
import { validateEmailForm, validateEmailLen } from "@/lib/auth/signup";
import { toastMessage } from "@/lib/common/toastMessage";
import {
    changePassword,
    requestFindPasswordCode,
    verifyFindPasswordCode,
} from "@/services/members";
import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 20;
const REQUEST_COOLDOWN_SECONDS = 59;

const INPUT_CLASS_NAME =
    "h-11 w-full rounded-md border border-gray-300 px-4 text-sm text-gray-900 outline-none transition focus:border-slate-500 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed cursor-text";

const getErrorMessage = (error: unknown, fallback: string) => {
    if (isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    console.error(error);
    return fallback;
};

const formatCountdown = (seconds: number) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const remainSeconds = String(seconds % 60).padStart(2, "0");

    return `${minutes}:${remainSeconds}`;
};

export default function FindPasswordPage() {
    const router = useRouter();

    // 입력 및 응답 상태 관리
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [successToken, setSuccessToken] = useState("");

    // UI 설정 상태 관리
    const [isCodeInputVisible, setIsCodeInputVisible] = useState(false);
    const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 타이머 시간 관리
    const {
        timeLeft: requestCooldown,
        start: startCooldown,
        reset: resetCooldown,
    } = useCountDown(0);

    // 검증 메소드
    const isEmailFormValid = validateEmailForm(email);
    const isEmailLenValid = validateEmailLen(email);
    const isEmailValid = isEmailFormValid && isEmailLenValid;

    const isPasswordLengthValid =
        password.length === 0 ||
        (password.length >= PASSWORD_MIN_LENGTH &&
            password.length <= PASSWORD_MAX_LENGTH);

    const isPasswordMatched =
        passwordConfirm.length > 0 && password === passwordConfirm;

    const isPasswordInputDisabled = !isVerificationSuccess || isSubmitting;

    const isFormValid =
        isVerificationSuccess &&
        successToken.trim() !== "" &&
        password.length >= PASSWORD_MIN_LENGTH &&
        password.length <= PASSWORD_MAX_LENGTH &&
        isPasswordMatched;

    const resetVerificationState = () => {
        setVerificationCode("");
        setPassword("");
        setPasswordConfirm("");
        setSuccessToken("");
        setIsCodeInputVisible(false);
        setIsVerificationSuccess(false);
        resetCooldown();
    };

    const handleEmailChange = (value: string) => {
        if (value !== email) {
            resetVerificationState();
        }

        setEmail(value);
    };

    // 인증 코드 요청 메소드
    const handleRequestCode = async () => {
        if (!isEmailValid || isRequesting || requestCooldown > 0) {
            return;
        }

        setIsRequesting(true);
        setVerificationCode("");
        setPassword("");
        setPasswordConfirm("");
        setSuccessToken("");
        setIsVerificationSuccess(false);

        try {
            await requestFindPasswordCode(email);
            setIsCodeInputVisible(true);
            startCooldown(REQUEST_COOLDOWN_SECONDS);
            toastMessage.success("인증 코드를 발송했습니다.");
        } catch (error) {
            toastMessage.error(
                getErrorMessage(error, "인증 코드 발송에 실패했습니다."),
            );
        } finally {
            setIsRequesting(false);
        }
    };

    // 인증 코드 검사 메소드
    const handleVerifyCode = async () => {
        if (!verificationCode || isVerifying || isVerificationSuccess) {
            return;
        }

        setIsVerifying(true);

        try {
            const response = await verifyFindPasswordCode(
                email,
                verificationCode,
            );

            if (!response.verification) {
                toastMessage.error("인증 코드를 다시 확인해 주세요.");
                return;
            }

            setSuccessToken(response.successCode);
            setIsVerificationSuccess(true);
            toastMessage.success("이메일 인증이 완료되었습니다.");
        } catch (error) {
            toastMessage.error(
                getErrorMessage(error, "인증 확인에 실패했습니다."),
            );
        } finally {
            setIsVerifying(false);
        }
    };

    // 비밀번호 변경 요청 메소드
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isFormValid) {
            return;
        }

        setIsSubmitting(true);

        try {
            await changePassword({
                successToken,
                password,
                passwordCheck: passwordConfirm,
            });
            toastMessage.success("비밀번호가 변경되었습니다.");
            router.replace("/auth/login");
        } catch (error) {
            toastMessage.error(
                getErrorMessage(error, "비밀번호 변경에 실패했습니다."),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center my-4">
            <form
                onSubmit={handleSubmit}
                autoComplete="off"
                className="flex flex-col items-center w-full max-w-md gap-3 p-6 space-y-2 bg-white border border-gray-200 rounded-lg shadow-md"
            >
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    비밀번호 변경
                </h1>

                <div className="w-full px-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700 cursor-text"
                        >
                            이메일
                        </label>
                        <div className="flex gap-3 mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) =>
                                    handleEmailChange(e.target.value)
                                }
                                placeholder="example@wise.co.kr"
                                disabled={isVerificationSuccess}
                                className={INPUT_CLASS_NAME}
                            />
                            <button
                                type="button"
                                onClick={handleRequestCode}
                                disabled={
                                    !isEmailValid ||
                                    isRequesting ||
                                    requestCooldown > 0 ||
                                    isVerificationSuccess
                                }
                                className="h-11 min-w-[92px] rounded-md bg-slate-600 px-4 text-sm font-semibold whitespace-nowrap text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300 cursor-pointer"
                            >
                                {isVerificationSuccess
                                    ? "인증완료"
                                    : isRequesting
                                      ? "요청 중..."
                                      : requestCooldown > 0
                                        ? formatCountdown(requestCooldown)
                                        : "인증요청"}
                            </button>
                        </div>
                        {!isEmailFormValid && (
                            <p className="px-1 text-sm text-red-500">
                                회사 이메일 형식으로 입력해 주세요.
                            </p>
                        )}
                    </div>

                    {isCodeInputVisible && (
                        <div className="mt-5">
                            <label
                                htmlFor="verificationCode"
                                className="text-sm font-medium text-gray-700"
                            >
                                인증코드
                            </label>
                            <div className="mt-2 flex items-center gap-3">
                                <input
                                    id="verificationCode"
                                    name="verificationCode"
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) =>
                                        setVerificationCode(e.target.value)
                                    }
                                    maxLength={6}
                                    disabled={isVerificationSuccess}
                                    className={INPUT_CLASS_NAME}
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyCode}
                                    disabled={
                                        !verificationCode ||
                                        isVerifying ||
                                        isVerificationSuccess
                                    }
                                    className="h-11 min-w-[92px] rounded-md bg-green-500 px-4 text-sm font-semibold whitespace-nowrap text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-slate-300 cursor-text"
                                >
                                    {isVerificationSuccess
                                        ? "확인완료"
                                        : isVerifying
                                          ? "확인 중..."
                                          : "인증확인"}
                                </button>
                            </div>
                            {isVerificationSuccess && (
                                <p className="mt-1 px-1 text-sm text-green-500">
                                    인증이 완료되었습니다.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="mt-5 w-full">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                        >
                            변경할 비밀번호 입력
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            maxLength={PASSWORD_MAX_LENGTH}
                            disabled={isPasswordInputDisabled}
                            className={INPUT_CLASS_NAME}
                        />
                        {!isPasswordLengthValid && (
                            <p className="mt-2 text-sm text-red-500">
                                비밀번호는 8자 이상 20자 이하로 입력해 주세요.
                            </p>
                        )}
                    </div>

                    <div className="mt-5">
                        <label
                            htmlFor="passwordConfirm"
                            className="text-sm font-medium text-gray-700"
                        >
                            비밀번호 확인
                        </label>
                        <input
                            id="passwordConfirm"
                            name="passwordConfirm"
                            type="password"
                            autoComplete="new-password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            maxLength={PASSWORD_MAX_LENGTH}
                            disabled={isPasswordInputDisabled}
                            className={INPUT_CLASS_NAME}
                        />
                        {passwordConfirm.length > 0 && (
                            <p
                                className={`mt-1 text-sm ${
                                    isPasswordMatched
                                        ? "text-green-500"
                                        : "text-red-500"
                                }`}
                            >
                                {isPasswordMatched
                                    ? "비밀번호가 일치합니다."
                                    : "비밀번호가 일치하지 않습니다."}
                            </p>
                        )}
                    </div>
                    <div className="mt-5">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className="w-full px-3 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed "
                        >
                            {isSubmitting ? "변경 중..." : "변경하기"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
