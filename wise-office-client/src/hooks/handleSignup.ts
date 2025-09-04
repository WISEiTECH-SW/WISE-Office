import { toastMessage } from "@/lib/common/toastMessage";
import { signup, requestCode, verifyCode } from "@/services/members";
import { signupForm } from "@/types/member";

export async function handleRequestCode(email: string) {
    try {
        await requestCode(email);
    } catch (err) {
        console.log("이메일 인증 요청 실패: ", err);
    }
}

export async function handleVerifyCode(
    email: string,
    verificationCode: string,
    setIsVerified: React.Dispatch<React.SetStateAction<boolean>>
) {
    try {
        await verifyCode({ email, verificationCode });
        setIsVerified(true);
    } catch (err) {
        console.log("이메일 인증 실패: ", err);
    }
}

export async function handleSignup(formData: signupForm) {
    try {
        await signup(formData);
        toastMessage.success("회원가입되었습니다.");
        return true;
    } catch (err) {
        console.log("회원가입 실패: ", err);
        toastMessage.error("회원가입에 실패했습니다.");
        throw err;
    }
}
