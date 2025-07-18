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

function makeForm(report_idx: number, generate = false) {
    const report_input = reports_input[report_idx];
    const number_of_resp = reports_input[report_idx].respondents_number;

    const form = {
        respondent_name: "Респондент",
        subjects: [] as FormSubjectT[],
    };
    form.subjects = report_input.subjects.map((subj) => {
        return {
            name: subj,
            criteria: layout.criteria.map((criterion) => {
                if (generate) {
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
                }
                return {
                    weight: 10,
                    score: 10,
                };
            }),
        };
    });
    return form;
}

function addFormToReport(report_idx: number) {
    const form = makeForm(report_idx);
    data.reports[report_idx].forms.push(form);
    reports_input[report_idx].respondents_number =
        data.reports[report_idx].forms.length;
}

function generate(from_selected_range = false) {
    const report_input = reports_input[selected_report_idx];

    let report = { forms: [] } as ReportFormDataT;

    for (
        let respondent_idx = 0;
        respondent_idx < report_input.respondents_number;
        respondent_idx++
    ) {
        const form = makeForm(selected_report_idx, from_selected_range);
        report.forms.push(form);
    }

    data.reports[selected_report_idx] = report;
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

let use_generation_ranges = $state(false);

const DataDirectionsDict = {
    "crit-v-subj-h": "Критерии по вертикали, дисциплины по горизонтали",
    "crit-h-subj-v": "Критерии по горизонтали, дисциплины по вертикали",
} as const;

type DataDirectionsT = keyof typeof DataDirectionsDict;

const WSOrderDict = {
    "weight-first": "Сначала вес, потом балл",
    "score-first": "Сначала балл, потом вес",
} as const;
type WSOrderT = keyof typeof WSOrderDict;

let data_direction: DataDirectionsT = $state("crit-v-subj-h");
let ws_cell_order: WSOrderT = $state("weight-first");

let outliersFound = $derived(gridParseResult?.outliers?.length > 0);
let missingValues = $derived(findMissingValues(gridParseResult.alignedGrid));
let dataDimensionsMatch = $derived.by(() => {
    if (!reports_input[selected_report_idx]) {
        return false;
    }
    const subj_num_dbl = reports_input[selected_report_idx].subjects.length * 2;
    const crit_num = layout.criteria.length;
    if (data_direction === "crit-v-subj-h") {
        return (
            gridParseResult.alignedGrid.length === crit_num &&
            gridParseResult.alignedGrid[0].length === subj_num_dbl
        );
    }
    if (data_direction === "crit-h-subj-v") {
        return (
            gridParseResult.alignedGrid.length === subj_num_dbl &&
            gridParseResult.alignedGrid[0].length === crit_num
        );
    }
    return false;
});

let errorsPresent = $derived(
    [outliersFound, missingValues.length > 0, !dataDimensionsMatch].some(
        (e) => e,
    ),
);

function readIntoForm() {
    if (data_direction === "crit-v-subj-h") {
        for (
            let crit_idx = 0;
            crit_idx < gridParseResult.alignedGrid.length;
            crit_idx++
        ) {
            for (
                let subj_h_idx = 0;
                subj_h_idx < gridParseResult.alignedGrid[crit_idx].length;
                subj_h_idx += 2
            ) {
                let score = 10;
                let weight = 10;
                const subj_idx = Math.floor(subj_h_idx / 2);
                if (ws_cell_order === "score-first") {
                    score =
                        gridParseResult.alignedGrid[crit_idx][subj_h_idx] || 10;
                    weight =
                        gridParseResult.alignedGrid[crit_idx][subj_h_idx + 1] ||
                        10;
                }
                if (ws_cell_order === "weight-first") {
                    weight =
                        gridParseResult.alignedGrid[crit_idx][subj_h_idx] || 10;
                    score =
                        gridParseResult.alignedGrid[crit_idx][subj_h_idx + 1] ||
                        10;
                }
                data.reports[selected_report_idx].forms[
                    selected_form_idx
                ].subjects[subj_idx].criteria[crit_idx] = { weight, score };
            }
        }
    } else if (data_direction === "crit-h-subj-v") {
        for (
            let subj_idx = 0;
            subj_idx < gridParseResult.alignedGrid.length;
            subj_idx++
        ) {
            for (
                let crit_h_idx = 0;
                crit_h_idx < gridParseResult.alignedGrid[subj_idx].length;
                crit_h_idx += 2
            ) {
                let score = 10;
                let weight = 10;
                const crit_idx = Math.floor(crit_h_idx / 2);
                if (ws_cell_order === "score-first") {
                    score =
                        gridParseResult.alignedGrid[subj_idx][crit_h_idx] || 10;
                    weight =
                        gridParseResult.alignedGrid[subj_idx][crit_h_idx + 1] ||
                        10;
                }
                if (ws_cell_order === "weight-first") {
                    weight =
                        gridParseResult.alignedGrid[subj_idx][crit_h_idx] || 10;
                    score =
                        gridParseResult.alignedGrid[subj_idx][crit_h_idx + 1] ||
                        10;
                }
                data.reports[selected_report_idx].forms[
                    selected_form_idx
                ].subjects[subj_idx].criteria[crit_idx] = { weight, score };
            }
        }
    }
}

function addFormToSelectedReport() {
    addFormToReport(selected_report_idx);
    selected_form_idx = data.reports[selected_report_idx]?.forms.length - 1;
}

function deleteSelectedForm() {
    data.reports[selected_report_idx].forms.splice(selected_form_idx, 1);
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

let someFormSelected = $derived(
    Boolean(data?.reports[selected_report_idx]?.forms[selected_form_idx]),
);
</script>

<div class="flex flex-col gap-2">
	<fieldset>
		<button class="btn" onclick={addFormToSelectedReport}>Добавить анкету</button>
		<button class="btn" onclick={deleteSelectedForm}>Удалить анкету</button>
	</fieldset>
</div>
<details class="m-2">
	<summary>Добавление данных по решётке</summary>

	<fieldset class="flex flex-col">
		{#each Object.entries(DataDirectionsDict) as [value, text]}
			<label>
				<input type="radio" name="dir" {value} bind:group={data_direction} />

				{text}
			</label>
		{/each}
	</fieldset>

	<fieldset class="flex flex-col">
		{#each Object.entries(WSOrderDict) as [value, text]}
			<label>
				<input type="radio" name="ws_cell_order" {value} bind:group={ws_cell_order} />

				{text}
			</label>
		{/each}
	</fieldset>

	<div class="flex items-center content-center gap-2">
		<div class="flex flex-col">
			<textarea class="txt-input" oninput={parseTextAreaContent} bind:value={addGridContent}
			></textarea>
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
			{#if !dataDimensionsMatch}
				Массив данных не сходится с размерами формы
			{/if}
		</div>
		{#if !errorsPresent}
			<div class="flex flex-col gap-2">
				<p>Ошибок не найдено</p>
				<button class="btn" onclick={readIntoForm}>Записать</button>
			</div>
		{/if}
	</div>
</details>

<div class="flex gap-2">
	<div class="flex flex-col gap-2">
		{#if reports_input.length > 0}
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
		{/if}

		<fieldset>
			<button class="btn" onclick={() => generate(use_generation_ranges)}>Генерировать</button>
			<label>
				<input type="checkbox" name="use_ranges" bind:checked={use_generation_ranges} />
				из выбранного диапазона
			</label>
		</fieldset>
	</div>

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

	{#if someFormSelected}
		<fieldset class="border rounded-lg">
			<legend>Данные респондента</legend>

			<div class="flex flex-col m-2">
				<label for="resp_name">Имя</label>

				<input
					class="txt-input"
					type="text"
					name="resp_name"
					id="resp_name"
					bind:value={data.reports[selected_report_idx].forms[selected_form_idx].respondent_name}
				/>
			</div>
		</fieldset>
	{/if}
</div>

{#if someFormSelected}
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
