import axios from "axios";

/**
 * 서버의 API 공통 Response는 아래의 형태로 반환됨
 * {
    "status": 400,
    "message": "DTO Error",
    "errors": {
        "key1" : "value1", 
        "key2" : "value2",
        ....
    },
    "timestamp": "2026-04-02T09:04:31.2649309"
}
 */
interface ErrorResponse {
    status: number;
    message: string;
    errors?: {
        [key: string]: string;
    };
    timestamp: string;
}

export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError<ErrorResponse>(error)) {
        const data = error.response?.data;

        /**
         * 에러 메세지가 아래의 형태인 경우
         * errors {
         *     "key1" : "value1",
         *     "key2" : "value2",
         * }
         * """
         * value1\n
         * value2
         * """"
         * 문자열로 반환
         */
        if (data?.errors) {
            const errorMessages = Object.values(data.errors);
            return errorMessages.join("\n");
        }

        if (data?.message) {
            return data.message;
        }
    }

    return "알 수 없는 오류가 발생했습니다.";
};
