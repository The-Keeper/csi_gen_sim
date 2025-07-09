import type {
    CellRange,
    CriterionT,
    ReportFormDataT,
    ReportInputT,
    XLSCell,
} from "./data";
import { avg, sum, standardDeviation } from "./math";

export const layout = $state<{ criteria: CriterionT[] }>({
    criteria: [
        {
            name: "Критерий 1",
            score_min: 8,
            score_max: 10,
            weight_min: 8,
            weight_max: 10,
        },
    ],
});

export const reports_input = $state<ReportInputT[]>([]);

export const data = $state<{ reports: ReportFormDataT[] }>({ reports: [] });

export const importer = $state<{
    form: { criteria: CellRange; subjects: CellRange };
} | null>();

export function add_report() {
    reports_input.push({ title: "", subjects: [], respondents_number: 1 });
}

export function output() {
    return { per_report_output, total_output };
}

const per_report_output = $derived(
    data.reports.map((report, report_idx) => {
        const subject_calc_by_respondents = report.forms.map((form) => {
            return {
                subjects: form.subjects.map((subj_data) => {
                    const weights_sum = sum(
                        subj_data.criteria.map((crit) => crit.weight),
                    );
                    return {
                        criteria: subj_data.criteria.map((crit) => {
                            const weight_norm = crit.weight / weights_sum;
                            return {
                                ...crit,
                                weight_norm,
                                score_norm: crit.score * weight_norm,
                            };
                        }),
                    };
                }),
            };
        });
        // console.log('by subjects', subject_calc_by_respondents);
        const total_by_respondents = subject_calc_by_respondents.map((form) => {
            return {
                subjects: form.subjects.map((subj) => {
                    return {
                        total_score: sum(
                            subj.criteria.map((crit) => crit.score_norm),
                        ),
                    };
                }),
            };
        });
        // console.log('total', total_by_respondents);
        const criterion_calc_by_subj = layout.criteria.map((crit, crit_idx) => {
            return {
                subjects: reports_input[report_idx].subjects.map(
                    (subject, subject_idx) => {
                        const mean_norm_score = avg(
                            subject_calc_by_respondents.map(
                                (form) =>
                                    form.subjects[subject_idx].criteria[
                                        crit_idx
                                    ].score,
                            ),
                        );
                        const deviation = standardDeviation(
                            subject_calc_by_respondents.map(
                                (form) =>
                                    form.subjects[subject_idx].criteria[
                                        crit_idx
                                    ].score,
                            ),
                        );
                        return {
                            mean_norm_score,
                            deviation,
                        };
                    },
                ),
            };
        });
        // console.log('criterion scores', criterion_calc_by_subj);
        const total_by_subject = reports_input[report_idx].subjects.map(
            (subj, subj_idx) => {
                const total = avg(
                    total_by_respondents.map(
                        (form) => form.subjects[subj_idx].total_score,
                    ),
                );
                const deviation = avg(
                    criterion_calc_by_subj.map(
                        (calc) => calc.subjects[subj_idx].deviation,
                    ),
                );
                return { total, deviation };
            },
        );
        // console.log('total_by_subject', total_by_subject);
        const criteria_total = layout.criteria.map((crit, crit_idx) => {
            const weight = avg(
                report.forms.map((form) => {
                    return (
                        sum(
                            form.subjects.map(
                                (subj) => subj.criteria[crit_idx].weight,
                            ),
                        ) / form.subjects.length
                    );
                }),
            );

            const score = avg(
                criterion_calc_by_subj[crit_idx].subjects.map(
                    (subj_calc) => subj_calc.mean_norm_score,
                ),
            );

            const deviation = avg(
                criterion_calc_by_subj[crit_idx].subjects.map(
                    (subj_calc) => subj_calc.deviation,
                ),
            );

            return { weight, score, deviation };
        });

        const totals = {
            score: avg(total_by_subject.map((calc) => calc.total)),
            deviation: avg(total_by_subject.map((calc) => calc.deviation)),
            criteria_wgt: avg(criteria_total.map((calc) => calc.weight)),
        };

        const min_max_crit_by_subj = reports_input[report_idx].subjects.map(
            (subj, subj_idx) => {
                const crit_data_for_this_subj = criterion_calc_by_subj.map(
                    (crit_data) => crit_data.subjects[subj_idx],
                );
                const scores = crit_data_for_this_subj.map(
                    (c) => c.mean_norm_score,
                );
                const min_score = Math.min(...scores);
                const max_score = Math.max(...scores);
                const min_criterion_idx = scores.findIndex(
                    (score) => score === min_score,
                );
                const max_criterion_idx = scores.findIndex(
                    (score) => score === max_score,
                );

                return {
                    name: subj,
                    min_score,
                    max_score,
                    min_criterion_idx,
                    max_criterion_idx,
                };
            },
        );

        return {
            criterion_calc_by_subj,
            total_by_subject,
            criteria_total,
            min_max_crit_by_subj,
            totals,
        };
    }),
);

const total_output = $derived.by(() => {
    const avg_total_by_crit = layout.criteria.map((crit, crit_idx) => {
        const weight = avg(
            per_report_output.map((report) => {
                return report.criteria_total[crit_idx].weight;
            }),
        );
        const score = avg(
            per_report_output.map((report) => {
                return report.criteria_total[crit_idx].score;
            }),
        );
        const deviation = avg(
            per_report_output.map((report) => {
                return report.criteria_total[crit_idx].deviation;
            }),
        );
        return { weight, score, deviation };
    });
    const score = avg(
        per_report_output.map((report) => {
            return report.totals.score;
        }),
    );
    const deviation = avg(
        per_report_output.map((report) => {
            return report.totals.deviation;
        }),
    );
    const avg_criteria_wgt = avg(
        per_report_output.map((report) => {
            return report.totals.criteria_wgt;
        }),
    );
    return {
        avg_total_by_crit,
        avg_criteria_wgt,
        totals: { score, deviation },
    };
});

export function remove_report_at_idx(idx: number) {
    reports_input.splice(idx, 1);
}
