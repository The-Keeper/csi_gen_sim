<script lang="ts">
	import { add_report, remove_report_at_idx, reports_input } from "$lib/store.svelte";
	import TextAreaArray from "$lib/components/TextAreaArray.svelte";
</script>

{#each reports_input as r_input, r_idx }
	<div>
		<div class="flex items-center justify-end gap-1">
			<label class="block" for="weight_min">Название отчёта</label>
			<input class="block" bind:value={r_input.title} />


			<input type="number" min="1" max="1000" bind:value={r_input.respondents_number} />

			<button onclick={() => remove_report_at_idx(r_idx)}>Удалить</button>
		</div>
		<TextAreaArray bind:values = {r_input.subjects} />	
	</div>
{/each}

<div>
	<button onclick={add_report}>Добавить отчёт</button>
</div>