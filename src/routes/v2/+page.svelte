<script lang="ts">
	import { add_report, reports_input, criteria } from "$lib/store.svelte";
	import ReportInputBlock from "../../components/ReportInputBlock.svelte";
</script>

{#each reports_input as r_input }
	<div>
		<ReportInputBlock bind:title = {r_input.title} bind:subjects = { r_input.subjects } />
	</div>
{/each}

<button onclick={add_report}>Добавить отчёт</button>

<pre>
	reports_input: { JSON.stringify(reports_input) }
	criteria: { JSON.stringify(criteria) }

</pre>