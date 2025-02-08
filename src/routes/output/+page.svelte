<script lang="ts">
	import { output } from "$lib/store.svelte";

    const data = $derived(output())
</script>
{#each data.per_report_output as report, report_idx}           
	<div class="flex flex-wrap gap-2 lg:flex-nowrap">
			<details open id="table_output">
				<summary>Выходная таблица данных</summary>
				<table>
					<tbody>
					{#each data.input.subjects as subject, i}
						<tr>
							<td>{i + 1}</td>
							<td>{subject}</td>

							{#each output.criterion_calc_by_subj as crit_by_subj, j}
								<td>
									{formatNumber(crit_by_subj.subjects[i].mean_norm_score * 10)}% ± {formatNumber(
										crit_by_subj.subjects[i].deviation * 10
									)}</td
								>
							{/each}
							<td> {formatNumber(output.total_by_subject[i].total * 10)}%</td>
							<td> {formatNumber(output.total_by_subject[i].deviation * 10)}</td>
						</tr>
					{/each}
					<tr>
						<td></td><td></td>
						{#each output.criteria_total as crit_total, i}
							<td>
								{formatNumber(crit_total.score * 10)}% ± {formatNumber(crit_total.deviation * 10)}</td
							>
						{/each}
						<td><b>{formatNumber(output.totals.score * 10)}%</b></td>
						<td><b>{formatNumber(output.totals.deviation * 10)}</b></td>
					</tr>
					<tr>
						<td></td><td></td>
						{#each output.criteria_total as crit_total, i}
							<td> {formatNumber(crit_total.weight, 2, 2)}</td>
						{/each}
						<td><b>{formatNumber(output.totals.criteria_wgt, 2, 2)}</b></td>
					</tr>
					</tbody>
				</table>
			</details>

			<details open>
				<summary>Выходной отчёт</summary>
				{#each output.min_max_crit_by_subj as out, j}
					<p>
						По дисциплине «{out.name}» наибольшее значение удовлетворённости студентов наблюдается
						по критерию «{data.input.criteria[out.max_criterion_idx].name}»: {formatNumber(
							out.max_score * 10
						)}%, а самое низкое значение — по критерию «{data.input.criteria[
							out.min_criterion_idx
						].name}»: {formatNumber(out.min_score * 10)}%.
					</p>
				{/each}
			</details>
	</div>
    {/each}
