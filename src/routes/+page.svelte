<script lang="ts">
	type GeneratedSubjectT = {
		name: string;
		criteria: {
			weight: number;
			score: number;
		}[];
	};

	let subjectTextArea = 'Предмет 1\nПредмет 2\nПредмет 3';
	$: data = {
		input: {
			respondents_number: 5,
			subjects: getSubjectNames(subjectTextArea),
			criteria: [
				{ name: 'Критерий 1', weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
				{ name: 'Критерий 2', weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
				{ name: 'Критерий 3', weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
				{ name: 'Критерий 4', weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
				{ name: 'Критерий 5', weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
				{ name: 'Критерий 6', weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
				{ name: 'Критерий 7', weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
				{ name: 'Критерий 8', weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
				{ name: 'Критерий 9', weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 },
				{ name: 'Критерий 10', weight_min: 5, weight_max: 10, score_min: 5, score_max: 10 }
			]
		},
		generated: [] as {
			name: string;
			subjects: GeneratedSubjectT[];
		}[],
		output: {
			subjects: [] as {
				name: string;
				criteria: {
					name: string;
					satisfaction_percent: number;
					deviation: number;
				}[];
				total_satisfaction_percent: number;
				deviation: number;
			}[],
			criteria: [] as {
				average_score: number;
				average_weight: number;
			}[]
		}
	};

	function randomIntFromInterval(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function generate() {
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
		return stringValue.split('\n').filter((s) => s.trim() != '');
	}

	function sum(array: number[]) {
		return array.reduce((partial_sum, a) => partial_sum + a, 0);
	}

	function standardDeviation(numbers: number[]) {
		let mean = sum(numbers) / numbers.length;
		let std_dev = 0;
		if (numbers.length > 1) {
			std_dev = Math.sqrt(numbers.reduce((acc, n) => (n - mean) ** 2) / (numbers.length - 1));
		}
		return std_dev;
	}

	function calculate() {
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
		console.log('by subjects', subject_calc_by_respondents);
		const total_by_respondents = subject_calc_by_respondents.map((form) => {
			return {
				subjects: form.subjects.map((subj) => {
					return {
						total_score: sum(subj.criteria.map((crit) => crit.score_norm))
					};
				})
			};
		});
		console.log('total', total_by_respondents);
		let crerion_calc_by_subj = data.input.criteria.map((crit, crit_idx) => {
			return {
				subjects: subject_calc_by_respondents.map((form, form_idx) => {
					const weighted_sum_for_this_subj = sum(
						form.subjects.map((subj, subj_idx) => subj.criteria[crit_idx].score_norm)
					);
                    const std_dev = standardDeviation(
                        form.subjects.map((subj, subj_idx) => subj.criteria[crit_idx].score)
                    )
					return {
						criterion_score: weighted_sum_for_this_subj / subject_calc_by_respondents.length,
                        std_dev
					};
				})
			};
		});
		console.log('criterion scores', crerion_calc_by_subj);
	}
</script>

<div>
	<input type="number" bind:value={data.input.respondents_number} />
</div>
<div>
	{#each data.input.criteria as criterion, i}
		<input bind:value={criterion.name} />

		<div>
			<label for="wgt_min">Вес от</label>
			<input id="wgt_min" type="number" min="1" max="10" bind:value={criterion.weight_min} />
			<label for="wgt_max">до</label>
			<input id="wgt_max" type="number" min="1" max="10" bind:value={criterion.weight_max} />
		</div>
		<div>
			<label for="score_min">Балл от</label>
			<input id="score_min" type="number" min="1" max="10" bind:value={criterion.score_min} />
			<label for="score_max">до</label>
			<input id="score_max" type="number" min="1" max="10" bind:value={criterion.score_max} />
		</div>
	{/each}
</div>

<textarea bind:value={subjectTextArea}></textarea>
<button on:click={generate}>Генерировать</button>
<button on:click={calculate}>Вычислить</button>

<pre>{JSON.stringify(data, null, 2)}</pre>
