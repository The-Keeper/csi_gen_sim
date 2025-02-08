export type GeneratedSubjectT = {
    name: string;
    criteria: {
        weight: number;
        score: number;
    }[];
};

export type CriterionT = {
    name: string,
    score_min: number,
    score_max: number,
    weight_min: number,
    weight_max: number,
};