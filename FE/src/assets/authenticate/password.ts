import zxcvbn from 'zxcvbn'

export interface T {
    score: number,
    text: string,
    color: "error" | "warning" | "info" | "success" | undefined,
}

export function passwordChecker(password: string): T {
    if (password === '') {
        return {
            score: 0,
            text: "~~~~",
            color: undefined,
        };
    }

    switch (zxcvbn(password).score) {
        case 0:
            return {
                score: 0,
                text: "Very Weak",
                color: "error",
            };
        case 1:
            return {
                score: 1,
                text: "Weak",
                color: "error",
            };
        case 2:
            return {
                score: 2,
                text: "Fair",
                color: "warning",
            };
        case 3:
            return {
                score: 3,
                text: "Good",
                color: "info",
            };
        case 4:
            return {
                score: 4,
                text: "Strong",
                color: "success",
            };
    }
}