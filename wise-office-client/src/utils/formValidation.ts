export const isFormComplete = <T extends object>(form: T): boolean => {
    return Object.values(form).every((value) => {
        if (typeof value === "string") {
            return value.trim() !== "";
        }
        return value !== null && value !== undefined;
    });
};
