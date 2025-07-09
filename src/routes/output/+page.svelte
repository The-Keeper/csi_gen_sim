<script lang="ts">
import { reports_input, output, layout } from "$lib/store.svelte";

const data = $derived(output());

function formatNumber(number: number, digits = 1, minimumFractionDigits = 1) {
    return number.toLocaleString("ru-RU", {
        maximumFractionDigits: digits,
        minimumFractionDigits,
    });
}
</script>
{#each data.per_report_output as report, report_idx}           
	<div class="flex flex-wrap gap-2 lg:flex-nowrap">
			<details open id="table_output">
				<summary>{reports_input[report_idx].title}</summary>
				<table>
					<tbody>
					{#each reports_input[report_idx].subjects as subject, i}
						<tr>
							<td>{i + 1}</td>
							<td>{subject}</td>

							{#each report.criterion_calc_by_subj as crit_by_subj, j}
								<td>
									{formatNumber(crit_by_subj.subjects[i].mean_norm_score * 10)}% ± {formatNumber(
										crit_by_subj.subjects[i].deviation * 10
									)}</td
								>
							{/each}
							<td> {formatNumber(report.total_by_subject[i].total * 10)}%</td>
							<td> {formatNumber(report.total_by_subject[i].deviation * 10)}</td>
						</tr>
					{/each}
					<tr>
						<td></td><td></td>
						{#each report.criteria_total as crit_total, i}
							<td>
								{formatNumber(crit_total.score * 10)}% ± {formatNumber(crit_total.deviation * 10)}</td
							>
						{/each}
						<td><b>{formatNumber(report.totals.score * 10)}%</b></td>
						<td><b>{formatNumber(report.totals.deviation * 10)}</b></td>
					</tr>
					<tr>
						<td></td><td></td>
						{#each report.criteria_total as crit_total, i}
							<td> {formatNumber(crit_total.weight, 2, 2)}</td>
						{/each}
						<td><b>{formatNumber(report.totals.criteria_wgt, 2, 2)}</b></td>
					</tr>
					</tbody>
				</table>
			</details>

			<details open>
				<summary>Выходной отчёт ({reports_input[report_idx].title})</summary>
				{#each report.min_max_crit_by_subj as out, j}
					<p>
						По дисциплине «{out.name}» наибольшее значение удовлетворённости студентов наблюдается
						по критерию «{layout.criteria[out.max_criterion_idx].name}»: {formatNumber(
							out.max_score * 10
						)}%, а самое низкое значение — по критерию «{layout.criteria[
							out.min_criterion_idx
						].name}»: {formatNumber(out.min_score * 10)}%.
					</p>
				{/each}
			</details>
	</div>
{/each}

<details open>
	<summary>Общие показатели по всем отчётам</summary>
	<table>
		<tbody>
		<tr>
			<td></td><td></td>
			{#each data.total_output.avg_total_by_crit as crit_total, i}
				<td>
					{formatNumber(crit_total.score * 10)}% ± {formatNumber(crit_total.deviation * 10)}</td
				>
			{/each}
			<td><b>{formatNumber(data.total_output.totals.score * 10)}%</b></td>
			<td><b>{formatNumber(data.total_output.totals.deviation * 10)}</b></td>
		</tr>
		<tr>
			<td></td><td></td>
			{#each data.total_output.avg_total_by_crit as crit_total, i}
				<td> {formatNumber(crit_total.weight, 2, 2)}</td>
			{/each}
			<td><b>{formatNumber(data.total_output.avg_criteria_wgt, 2, 2)}</b></td>
		</tr>
		</tbody>
	</table>
</details>
