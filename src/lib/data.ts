export type FormSubjectT = {
    name: string;
    criteria: {
        weight: number;
        score: number;
    }[];
};

export type ReportInputT = {
    title: string,
    subjects: string[],
    respondents_number: number,
}

export type CriterionT = {
    name: string,
    score_min: number,
    score_max: number,
    weight_min: number,
    weight_max: number,
};

export type ReportFormDataT = {
    forms: {
        respondent_name: string,
        subjects: FormSubjectT[]
    }[]
}