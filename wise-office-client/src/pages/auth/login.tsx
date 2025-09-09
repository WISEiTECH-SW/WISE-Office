import { handleLogin } from "@/hooks/handleLogin";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string | undefined>(undefined);
    const [save, setSave] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        if (savedEmail) {
            setEmail(savedEmail);
            setSave(true);
        }
    }, []);

    const clickLoginButton = async () => {
        const res = await handleLogin({ email, password, save });

        if (res.ok === 200) {
            router.replace("/");
        } else if (res.status === 400 || res.status === 401) {
            setLoginError(res.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    로그인
                </h1>
                <form
                    className="space-y-6"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {loginError && (
                        <p className="mt-1 text-sm text-red-600">
                            {loginError}
                        </p>
                    )}
                </form>

                <div className="flex items-center">
                    <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        checked={save}
                        onChange={(e) => setSave(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label
                        htmlFor="remember"
                        className="ml-2 block text-sm text-gray-700"
                    >
                        이메일 저장
                    </label>
                </div>

                <button
                    onClick={clickLoginButton}
                    className={`w-full px-4 py-2 font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 
                        ${
                            !email || !password
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 cursor-pointer"
                        }`}
                >
                    로그인
                </button>
                <div className="text-sm text-center">
                    <p className="text-gray-600">
                        계정이 없으신가요?{" "}
                        <Link href="/auth/signup">
                            <span className="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500">
                                회원가입
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
