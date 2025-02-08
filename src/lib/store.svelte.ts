import type { CriterionT, ReportFormDataT, ReportInputT } from "./data";

export const layout = $state<{ criteria: CriterionT[] }>(
    {  
        criteria: [{ name: 'Критерий 1', score_min: 8, score_max: 10, weight_min: 8, weight_max: 10 }]
    }
);

export const reports_input = $state<ReportInputT[]>([]);

export const reports = $state<ReportFormDataT[]>([])

export function add_report() {
    reports_input.push({title: '', subjects: []})
}

export function remove_report_at_idx(idx: number) {
    reports_input.splice(idx, 1);
}