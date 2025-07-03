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

let selected_report_idx = $state(0);
let selected_form_idx = $state(0);
</script>

<div>
	<button class="btn" onclick={generate}>Генерировать</button>
</div>

<div>
	<select name="selected_report" bind:value={selected_report_idx}>
		{#each reports_input as report_input, i}
			<option value={i}>{report_input.title}</option>
		{/each}
	</select>

	<select name="selected_report" bind:value={selected_form_idx}>
		{#each data.reports[selected_report_idx].forms as form, i}
			<option value={i}>{form.respondent_name}</option>
		{/each}
	</select>
</div>

<div class="w-full overflow-x-auto whitespace-nowrap py-4">
	{#each data.reports[selected_report_idx].forms[selected_form_idx].subjects as subject_data, i}
		<div class="inline-flex space-x-4">
			<div class="inline-flex flex-col w-64 justify-between border rounded-lg overflow-hidden">
				<h4 class="whitespace-normal">{subject_data.name}</h4>
				<div class="flex-1 overflow-y-auto">
					{#each subject_data.criteria as criterion, j}
						<div class="flex items-center justify-end gap-1">
							<label class="block" for="weight_min">Вес</label>
							<input
								class="block max-w-20 main"
								id="weight"
								type="number"
								min="1"
								max="10"
								bind:value={criterion.weight}
							/>
							<label class="block" for="weight_max">Балл</label>
							<input
								class="block max-w-20 main"
								id="score"
								type="number"
								min="1"
								max="10"
								bind:value={criterion.score}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/each}
</div>
