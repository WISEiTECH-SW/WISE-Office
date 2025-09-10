// 회사 도메인 이메일 형태를 검사하는 메소드
export const validateEmailForm = (value: string) => {
    const re = /^.+@wise\.co\.kr$/;
    return re.test(value);
};

// 이메일 길이를 검사하는 메소드
export const validateEmailLen = (value: string) => {
    return value.length > 0;
};
