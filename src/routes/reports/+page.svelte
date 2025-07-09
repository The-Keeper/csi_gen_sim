<script lang="ts">
import {
    add_report,
    remove_report_at_idx,
    reports_input,
} from "$lib/store.svelte";
import TextAreaArray from "$lib/components/TextAreaArray.svelte";
</script>

<div class="flex flex-col gap-4 w-full">
{#each reports_input as r_input, r_idx }
		<div class="flex items-stretch gap-3">
			<div class="flex items-start justify-end gap-1">

				<div class="flex items-end gap-2">
					<div>
						<label class="block" for="{`title_${r_idx}`}">Название отчёта</label>
						<input class="main" id="{`title_${r_idx}`}" bind:value={r_input.title} />	
					</div>
	
					<div>
						<label class="block" for="{`number_${r_idx}`}">Число респондентов</label>
						<input class="main" type="number" min="1" max="1000" bind:value={r_input.respondents_number} />
					</div>
				</div>

			</div>
			<TextAreaArray bind:values = {r_input.subjects} />	
			<button class='btn block h-12' onclick={() => remove_report_at_idx(r_idx)}>Удалить отчет</button>

		</div>
	{/each}

	<button class='btn' onclick={add_report}>Добавить отчёт</button>
</div>