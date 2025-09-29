import { toastMessage } from "@/lib/common/toastMessage";
import { signup, requestCode, verifyCode } from "@/services/members";
import { SignupForm } from "@/types/member";
import { isAxiosError } from "axios";

// 이메일 인증 코드 발송
export async function handleEmailVerify(email: string) {
    if (!email) return;

    try {
        await requestCode(email);
        return true;
    } catch (err) {
        if (isAxiosError(err)) {
            const message = err.response?.data.message || "알수 없는 오류 발생";
            toastMessage.error(message);
        } else {
            console.error("일반적인 에러:", err);
        }
        return false;
    }
}

// 인증 코드 확인
export async function handleCodeVerify(
    email: string,
    verificationCode: string
) {
    try {
        return await verifyCode(email, verificationCode);
    } catch (err) {
        console.log("이메일 인증 실패: ", err);
        return false;
    }
}

// 회원가입 진행
export async function handleSummitSignUpForm(formData: SignupForm) {
    try {
        console.log(formData);
        // await signup(formData);
        // toastMessage.success("회원가입되었습니다.");
        return true;
    } catch (err) {
        console.log("회원가입 실패: ", err);
        toastMessage.error("회원가입에 실패했습니다.");
        return false;
    }
}
