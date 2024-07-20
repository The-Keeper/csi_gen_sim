<script lang="ts">
	import CriterionCard from '../components/CriterionCard.svelte';

	type GeneratedSubjectT = {
		name: string;
		criteria: {
			weight: number;
			score: number;
		}[];
	};

	let subjectTextArea = [...Array(3).keys()].map((val) => `Предмет ${val + 1}`).join('\n');
	let criteriaTextArea = [...Array(10).keys()].map((val) => `Критерий ${val + 1}`).join('\n');
	let all_wgt_min = 5;
	let all_wgt_max = 10;
	let all_score_min = 8;
	let all_score_max = 10;

	let files: FileList;
	let fileInput: any;
	$: if (files) {
		let reader = new FileReader();

		// Note that `files` is of type `FileList`, not an Array:
		// https://developer.mozilla.org/en-US/docs/Web/API/FileList
		for (const file of files) {
			reader.readAsText(file);
			reader.onload = (e) => {
				let result = JSON.parse(String(e.target?.result) || '');
				subjectTextArea = result.input.subjects.join('\n');
				criteriaTextArea = result.input.criteria.map((crit: any) => crit.name).join('\n');
				data = result;
				fileInput.value = '';
			};
		}
	}

	let data = {
		input: {
			respondents_number: 5,
			subjects: ['Предмет 1', 'Предмет 2'],
			criteria: []
		},
		generated: [] as {
			name: string;
			subjects: GeneratedSubjectT[];
		}[]
	};
	$: if (subjectTextArea.length > 0) {
		data.input.subjects = getSubjectNames(subjectTextArea);
	}
	$: output = calculate(data.generated);

	function randomIntFromInterval(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function generate(_obj: any) {
		let result = [] as { name: string; subjects: GeneratedSubjectT[] }[];
		for (let respondent_idx = 0; respondent_idx < data.input.respondents_number; respondent_idx++) {
			let form = { name: `Респондент ${respondent_idx + 1}`, subjects: [] as GeneratedSubjectT[] };
			form.subjects = data.input.subjects.map((subj) => {
				return {
					name: subj,
					criteria: data.input.criteria.map((criterion) => {
						return {
							weight: randomIntFromInterval(criterion.weight_min, criterion.weight_max),
							score: randomIntFromInterval(criterion.score_min, criterion.score_max)
						};
					})
				};
			});
			result.push(form);
		}
		data.generated = result;
	}

	function getSubjectNames(stringValue: string) {
		return stringValue
			.split('\n')
			.filter((s) => s.trim() != '')
			.map((name) => name.trim());
	}

	fill_criteria_names();

	function sum(array: number[]) {
		return array.reduce((partial_sum, a) => partial_sum + a, 0);
	}

	function avg(array: number[]) {
		return sum(array) / array.length;
	}

	function standardDeviation(numbers: number[]) {
		let mean = sum(numbers) / numbers.length;
		let std_dev = 0;
		if (numbers.length > 1) {
			std_dev = Math.sqrt(numbers.reduce((acc, n) => (n - mean) ** 2) / (numbers.length - 1));
		}
		return std_dev;
	}

	function saveTemplateAsFile(filename: string, dataObjToWrite: object) {
		const blob = new Blob([JSON.stringify(dataObjToWrite, null, 2)], { type: 'text/json' });
		const link = document.createElement('a');

		link.download = filename;
		link.href = window.URL.createObjectURL(blob);
		link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');

		const evt = new MouseEvent('click', {
			view: window,
			bubbles: true,
			cancelable: true
		});

		link.dispatchEvent(evt);
		link.remove();
	}

	function saveData() {
		saveTemplateAsFile('данные.json', data);
	}

	function calculate(_obj: any) {
		const subject_calc_by_respondents = data.generated.map((form) => {
			return {
				subjects: form.subjects.map((subj_data) => {
					const weights_sum = sum(subj_data.criteria.map((crit) => crit.weight));
					return {
						criteria: subj_data.criteria.map((crit) => {
							const weight_norm = crit.weight / weights_sum;
							return { ...crit, weight_norm, score_norm: crit.score * weight_norm };
						})
					};
				})
			};
		});
		// console.log('by subjects', subject_calc_by_respondents);
		const total_by_respondents = subject_calc_by_respondents.map((form) => {
			return {
				subjects: form.subjects.map((subj) => {
					return {
						total_score: sum(subj.criteria.map((crit) => crit.score_norm))
					};
				})
			};
		});
		// console.log('total', total_by_respondents);
		let criterion_calc_by_subj = data.input.criteria.map((crit, crit_idx) => {
			return {
				subjects: data.input.subjects.map((subject, subject_idx) => {
					const mean_norm_score = avg(
						subject_calc_by_respondents.map(
							(form) => form.subjects[subject_idx].criteria[crit_idx].score
						)
					);
					const deviation = standardDeviation(
						subject_calc_by_respondents.map(
							(form) => form.subjects[subject_idx].criteria[crit_idx].score
						)
					);
					return {
						mean_norm_score,
						deviation
					};
				})
			};
		});
		// console.log('criterion scores', criterion_calc_by_subj);
		const total_by_subject = data.input.subjects.map((subj, subj_idx) => {
			const total = avg(total_by_respondents.map((form) => form.subjects[subj_idx].total_score));
			const deviation = avg(
				criterion_calc_by_subj.map((calc) => calc.subjects[subj_idx].deviation)
			);
			return { total, deviation };
		});
		// console.log('total_by_subject', total_by_subject);
		const criteria_total = data.input.criteria.map((crit, crit_idx) => {
			const weight =
				sum(
					data.generated.map((form) => {
						return (
							sum(form.subjects.map((subj) => subj.criteria[crit_idx].weight)) /
							form.subjects.length
						);
					})
				) / data.generated.length;

			const score = avg(
				criterion_calc_by_subj[crit_idx].subjects.map((subj_calc) => subj_calc.mean_norm_score)
			);

			const deviation = avg(
				criterion_calc_by_subj[crit_idx].subjects.map((subj_calc) => subj_calc.deviation)
			);

			return { weight, score, deviation };
		});

		const totals = {
			score: avg(total_by_subject.map((calc) => calc.total)),
			deviation: avg(total_by_subject.map((calc) => calc.deviation)),
			criteria_wgt: avg(criteria_total.map((calc) => calc.weight))
		};

		const min_max_crit_by_subj = data.input.subjects.map((subj, subj_idx) => {
			const crit_data_for_this_subj = criterion_calc_by_subj.map(
				(crit_data) => crit_data.subjects[subj_idx]
			);
			const scores = crit_data_for_this_subj.map((c) => c.mean_norm_score);
			const min_score = Math.min(...scores);
			const max_score = Math.max(...scores);
			const min_criterion_idx = scores.findIndex((score) => score == min_score);
			const max_criterion_idx = scores.findIndex((score) => score == max_score);

			return {
				name: subj,
				min_score,
				max_score,
				min_criterion_idx,
				max_criterion_idx
			};
		});

		return {
			criterion_calc_by_subj,
			total_by_subject,
			criteria_total,
			min_max_crit_by_subj,
			totals
		};
	}

	function fill_criteria_names() {
		const criteria_names = criteriaTextArea.split('\n').filter((s) => s.trim() != '');
		data.input.criteria = criteria_names.map((crit, crit_idx) => {
			return {
				name: crit.trim(),
				score_min: all_score_min,
				score_max: all_score_max,
				weight_min: all_wgt_min,
				weight_max: all_wgt_max
			};
		});
	}
</script>

<div class="flex flex-wrap gap-2">
	<div class="flex-col gap-2">
		<div class="flex-col">
			<div class="block m-2">
				<button on:click={generate}>Генерировать</button>
				<button on:click={calculate}>Вычислить</button>
			</div>
			<div class="block m-2">
				<button on:click={saveData}>Сохранить данные</button>
				<div>
					<label for="datafile">Загрузить данные из файла:</label>
					<input class="w-sm"
						accept="text/json"
						bind:files
						id="datafile"
						name="datafile"
						type="file"
						bind:this={fileInput}
					/>
				</div>
			</div>
		</div>
		<div>
			<label class="block" for="respondents_number">Число респондентов:</label>
			<input
				class="block"
				id="respondents_number"
				type="number"
				bind:value={data.input.respondents_number}
			/>
		</div>
		<div>
			<label class="block" for="subject_names">Названия предметов:</label>
			<textarea class="block w-80 h-40" id="subject_names" bind:value={subjectTextArea}></textarea>
		</div>
		<details>
			<summary>Заполнить названия критериев</summary>
			<textarea class="block w-80 h-40" bind:value={criteriaTextArea}></textarea>
			<div class="flex items-center justify-end gap-1">
				<label for="all_wgt_min">Вес от</label>
				<input id="all_wgt_min" type="number" min="1" max="10" bind:value={all_wgt_min} />
				<label for="all_wgt_max">до</label>
				<input id="all_wgt_max" type="number" min="1" max="10" bind:value={all_wgt_max} />
			</div>
			<div class="flex items-center justify-end gap-1">
				<label for="all_score_min">Балл от</label>
				<input id="all_score_min" type="number" min="1" max="10" bind:value={all_score_min} />
				<label for="all_score_max">до</label>
				<input id="all_score_max" type="number" min="1" max="10" bind:value={all_score_max} />
			</div>
			<button on:click={fill_criteria_names}>Заполнить</button>
		</details>
	</div>
    <details open>
        <summary>Критерии</summary>
        <div class="flex flex-wrap inline w-160 gap-2">
            {#each data.input.criteria as criterion, i}
                <CriterionCard bind:criterion />
            {/each}
        </div>
    </details>
	<div id="output-section" class="flex gap-2">
		{#if data.generated.length > 0}
			<details open id="table_output">
				<summary>Выходная таблица данных</summary>
				<table>
					{#each data.input.subjects as subject, i}
						<tr>
							<td>{i + 1}</td>
							<td>{subject}</td>

							{#each output.criterion_calc_by_subj as crit_by_subj, j}
								<td>
									{(crit_by_subj.subjects[i].mean_norm_score * 10).toFixed(1)}% ± {(
										crit_by_subj.subjects[i].deviation * 10
									).toFixed(1)}</td
								>
							{/each}
							<td> {(output.total_by_subject[i].total * 10).toFixed(1)}%</td>
							<td> {(output.total_by_subject[i].deviation * 10).toFixed(1)}</td>
						</tr>
					{/each}
					<tr>
						<td></td><td></td>
						{#each output.criteria_total as crit_total, i}
							<td>
								{(crit_total.score * 10).toFixed(1)}% ± {(crit_total.deviation * 10).toFixed(1)}</td
							>
						{/each}
						<td><b>{(output.totals.score * 10).toFixed(1)}%</b></td>
						<td><b>{(output.totals.deviation * 10).toFixed(1)}</b></td>
					</tr>
					<tr>
						<td></td><td></td>
						{#each output.criteria_total as crit_total, i}
							<td> {crit_total.weight.toFixed(2)}</td>
						{/each}
						<td><b>{output.totals.criteria_wgt.toFixed(2)}</b></td>
					</tr>
				</table>
			</details>
		{/if}

		{#if data.generated.length > 0}
			<details open id="text_report">
				<summary>Выходной отчёт</summary>
				{#each output.min_max_crit_by_subj as out, j}
					<p>
						По дисциплине «{out.name}» наибольшее значение удовлетворённости студентов наблюдается
						по критерию «{data.input.criteria[out.max_criterion_idx].name}»: {(
							out.max_score * 10
						).toFixed(1)}%, а самое низкое значение — по критерию «{data.input.criteria[
							out.min_criterion_idx
						].name}»: {(out.min_score * 10).toFixed(1)}%.
					</p>
				{/each}
			</details>
		{/if}
	</div>
</div>
<footer class="text-center">Лицензия MIT (никаких гарантий)</footer>
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(output, null, 2)}</pre> -->
