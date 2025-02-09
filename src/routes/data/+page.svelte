<script lang="ts">
import type { FormSubjectT, ReportFormDataT } from "$lib/data";
import { data, reports_input, layout } from "$lib/store.svelte";
import { randomIntFromInterval } from "$lib/math";

function generate() {
	let result = [] as ReportFormDataT[];
	for (let report_idx = 0; report_idx < reports_input.length; report_idx++) {
		const report_input = reports_input[report_idx];

		let report = { forms: [] } as ReportFormDataT;

		for (
			let respondent_idx = 0;
			respondent_idx < report_input.respondents_number;
			respondent_idx++
		) {
			const form = {
				respondent_name: `Респондент ${respondent_idx + 1}`,
				subjects: [] as FormSubjectT[],
			};
			form.subjects = report_input.subjects.map((subj) => {
				return {
					name: subj,
					criteria: layout.criteria.map((criterion) => {
						return {
							weight: randomIntFromInterval(
								criterion.weight_min,
								criterion.weight_max,
							),
							score: randomIntFromInterval(
								criterion.score_min,
								criterion.score_max,
							),
						};
					}),
				};
			});
			report.forms.push(form);
		}

		result.push(report);
	}

	data.reports = result;
}
</script>


<div>
	<button class='btn' onclick={generate}>Генерировать</button>
</div>
