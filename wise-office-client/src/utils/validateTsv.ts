import type { Row } from "@/types/annualLeave";

export type ValidateResult<Row> = {
    ok: boolean;
    errors: string;
    rows?: Row[];
};

const REQUIRED_COLS = 9;

export function validateTsv(text: string): ValidateResult<Row> {
    // 입력이 비어있는 경우
    if (!text || text.trim().length === 0)
        return {
            ok: false,
            errors: "입력이 비어있습니다. 표를 붙여넣기 하세요.",
        };

    // 패턴 검증
    const lines = text.split("\n");
    // 각 라인은 \t로 구분되어 7칸이며, \n로 끝남
    const pattern = /^([^\n]*\t){6}[^\n]*$/;
    const failedLine = lines.findIndex((line) => {
        !pattern.test(line);
    });
    if (failedLine !== -1) {
        return {
            ok: false,
            errors: "올바른 형식이 아닙니다. 모든 데이터를 정확하게 붙여넣기 하세요.",
        };
    }

    const data: Row[] = [];

    for (let i = 0; i < lines.length; i++) {
        const checkingLine = lines[i];

        if (checkingLine.length === 0) {
            return {
                ok: false,
                errors: `${i + 1}행: 빈 줄은 허용되지 않습니다.`,
            };
        }

        const cols = checkingLine.split("\t");

        if (cols.length !== REQUIRED_COLS) {
            return {
                ok: false,
                errors: `${i + 1}행: 열 개수가 ${REQUIRED_COLS}개가 아닙니다.`,
            };
        }

        const rowData: Row = {
            date: cols[0] === "" ? "-" : cols[0],
            category: cols[1] ?? "-",
            days: cols[2] ?? "-",
            requestedAt: cols[3] ?? "-",
            approver: cols[6] ?? "-",
            status: cols[7] ?? "-",
            flag: cols[8] === "Y" ? "✅" : "-",
        };

        data.push(rowData);
    }
    return { ok: true, errors: "", rows: data };
}
