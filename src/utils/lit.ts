import type { ComplexAttributeConverter } from "lit";

export const stringToArrayConverter: ComplexAttributeConverter<string[]> = {
    fromAttribute: (value: string | null) => {
        if (!value) return [];
        return value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
    },
    toAttribute: (value: string[]) => {
        return value.join(",");
    },
};
