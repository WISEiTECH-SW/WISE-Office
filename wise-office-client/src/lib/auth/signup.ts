// 회사 도메인 이메일 형태를 검사하는 메소드
export const validateEmailForm = (value: string) => {
    const re = /^.+@wise\.co\.kr$/;
    return re.test(value);
};

// 이메일 길이를 검사하는 메소드
export const validateEmailLen = (value: string) => {
    return value.length > 0;
};

// 시간을 `00:xx` 형태로 변환해주는 메호드
export const formatTime = (sec: number) => {
    const minutes = String(Math.floor(sec / 60)).padStart(2, "0");
    const seconds = String(sec % 60).padStart(2, "0");
    return ` ${minutes} : ${seconds} `;
};
