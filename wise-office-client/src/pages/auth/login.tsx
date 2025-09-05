import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
// hook으로 이동 후 삭제 필요
import { toastMessage } from "@/lib/common/toastMessage";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual login logic
        console.log("Login attempt with:", { email, password });

        try {
            await axios.post(
                "http://localhost:8080/api/members/login",
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );
            toastMessage.success("로그인 되었습니다");
            router.push("/");
        } catch (error) {
            console.log(error);
            toastMessage.error(error.response.data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    로그인
                </h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                        >
                            이메일
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                        >
                            비밀번호
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            로그인
                        </button>
                    </div>
                </form>
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
