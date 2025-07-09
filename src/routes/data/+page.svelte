<script lang="ts">
import type { FormSubjectT, ReportFormDataT } from "$lib/data";
import { data, reports_input, layout } from "$lib/store.svelte";
import { randomIntFromInterval } from "$lib/math";
import {
    findAlignedGridAndOutliers,
    findMissingValues,
    type AlignmentResult,
} from "$lib/grid";
import { useSortable, reorder } from "$lib/use-sortable.svelte";

function addFormToReport(report_idx: number) {
    const report_input = reports_input[report_idx];
    const number_of_resp = data.reports[report_idx].forms.length;

    const form = {
        respondent_name: `Респондент ${number_of_resp + 1}`,
        subjects: [] as FormSubjectT[],
    };
    form.subjects = report_input.subjects.map((subj) => {
        return {
            name: subj,
            criteria: layout.criteria.map((criterion) => {
                return {
                    weight: 10,
                    score: 10,
                };
            }),
        };
    });
    data.reports[report_idx].forms.push(form);
    reports_input[report_idx].respondents_number =
        data.reports[report_idx].forms.length;
}

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

function parseTextAreaContent() {
    gridParseResult = findAlignedGridAndOutliers(addGridContent);
}

let selected_report_idx = $state(0);
let selected_form_idx = $state(0);

let addGridContent = $state("");
let gridParseResult = $state({
    alignedGrid: [],
    outliers: [],
}) as AlignmentResult;

let outliersFound = $derived(gridParseResult?.outliers?.length > 0);
let missingValues = $derived(findMissingValues(gridParseResult.alignedGrid));

function addFormToSelectedReport() {
    addFormToReport(selected_report_idx);
    selected_form_idx = data.reports[selected_report_idx].forms.length - 1;
}

let forms_sortable = $state<HTMLElement | null>(null);

useSortable(() => forms_sortable, {
    animation: 200,
    // handle: '.my-handle',
    ghostClass: "opacity-0",
    onEnd(evt) {
        data.reports[selected_report_idx].forms = reorder(
            data.reports[selected_report_idx].forms,
            evt,
        );
    },
});
</script>

<div>
	<button class="btn" onclick={generate}>Генерировать</button>
	<button class="btn" onclick={addFormToSelectedReport}>Добавить анкету</button>
</div>

<details>
	<summary>Добавление данных по решётке</summary>

	<div class="flex">
		<div class="flex flex-col">
			<textarea bind:value={addGridContent}></textarea>

			<button class="btn" onclick={parseTextAreaContent}>Прочитать</button>
		</div>

		<div>
			{#if outliersFound}
				{#each gridParseResult.outliers as outlier, i}
					<p>
						Найден элемент вне решётки в {outlier.col + 1}-й колонке {outlier.row + 1}-й строки: {outlier.value}
					</p>
				{/each}
			{/if}
			{#if missingValues.length > 0}
				{#each missingValues as mv, i}
					<p>
						Отсутствует значение в клетке: строка {mv.row + 1}, колонка {mv.col + 1}
					</p>
				{/each}
			{/if}
		</div>
	</div>
</details>

<div class="flex gap-2">
	<ul class="w-sm overflow-y-auto h-30">
		{#each reports_input as report_input, i}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<li
				role="option"
				aria-selected={selected_report_idx === i}
				class={`${selected_report_idx === i ? 'bg-blue-500' : 'bg-gray-500'}`}
				onclick={() => (selected_report_idx = i)}
			>
				{report_input.title}
			</li>
		{/each}
	</ul>

	<ul class="w-sm overflow-y-auto h-30" bind:this={forms_sortable}>
		{#each data.reports[selected_report_idx]?.forms as item, i (item)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<li
				role="option"
				aria-selected={selected_form_idx === i}
				class={`${selected_form_idx === i ? 'bg-blue-500' : 'bg-gray-500'}`}
				onclick={() => (selected_form_idx = i)}
			>
				{item.respondent_name}
			</li>
		{/each}
	</ul>
</div>

{#if data?.reports[selected_report_idx]?.forms[selected_form_idx]}
	<div class="w-full overflow-x-auto whitespace-nowrap py-4">
		{#each data.reports[selected_report_idx].forms[selected_form_idx].subjects as subject_data, i}
			<div
				class="inline-flex content-center items-center flex-col w-64 h-75 justify-between border rounded-lg overflow-hidden"
			>
				<p class="whitespace-normal">{subject_data.name}</p>
				<div class="overflow-y-auto">
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
		{/each}
	</div>
{/if}
