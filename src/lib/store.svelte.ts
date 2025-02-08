import type { CriterionT, ReportFormDataT } from "./data";

export const criteria = $state<CriterionT[]>([{ name: 'Критерий 1', score_min: 8, score_max: 10, weight_min: 8, weight_max: 10 }])

export const reports_input = $state<{ title: string, subjects: string[] }[]>([]);

export const reports = $state<ReportFormDataT[]>([])

export function add_report() {
    reports_input.push({title: '', subjects: []})
}